const admin = require('firebase-admin');
const User = require('../models/user.model');

const USERS_COLLECTION = 'users';

/**
 * UserRepository - Handles all database operations for users
 * Separates data persistence from business logic
 */
class UserRepository {
  /**
   * Create a new user in Firestore
   */
  async create(userData) {
    try {
      // Create User instance from data
      const user = new User(userData);

      // Hash password if provided
      if (user.password) {
        await user.hashPassword();
      }

      user.id = user.email;
      user.createdAt = new Date();
      user.updatedAt = new Date();

      const db = admin.firestore();
      const userRef = db.collection(USERS_COLLECTION).doc(user.email.toLowerCase());

      // Prepare data for Firestore
      const firestoreData = this._prepareForFirestore(user);

      await userRef.set(firestoreData, { merge: true });

      return user;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    try {
      const db = admin.firestore();
      const userRef = db.collection(USERS_COLLECTION).doc(email.toLowerCase());
      const doc = await userRef.get();

      if (!doc.exists) {
        return null;
      }

      return new User(doc.data());
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  /**
   * Find user by ID (which is email)
   */
  async findById(id) {
    return this.findByEmail(id);
  }

  /**
   * Find user by Google ID
   */
  async findByGoogleId(googleId) {
    try {
      const db = admin.firestore();
      const snapshot = await db
        .collection(USERS_COLLECTION)
        .where('googleId', '==', googleId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      return new User(snapshot.docs[0].data());
    } catch (error) {
      throw new Error(`Error finding user by Google ID: ${error.message}`);
    }
  }

  /**
   * Find user by Facebook ID
   */
  async findByFacebookId(facebookId) {
    try {
      const db = admin.firestore();
      const snapshot = await db
        .collection(USERS_COLLECTION)
        .where('facebookId', '==', facebookId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      return new User(snapshot.docs[0].data());
    } catch (error) {
      throw new Error(`Error finding user by Facebook ID: ${error.message}`);
    }
  }

  /**
   * Check if email exists
   */
  async emailExists(email) {
    try {
      const user = await this.findByEmail(email);
      return user !== null;
    } catch (error) {
      throw new Error(`Error checking email: ${error.message}`);
    }
  }

  /**
   * Update user data
   */
  async update(email, updateData) {
    try {
      const db = admin.firestore();
      updateData.updatedAt = new Date();

      await db
        .collection(USERS_COLLECTION)
        .doc(email.toLowerCase())
        .update(updateData);

      return this.findByEmail(email);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  /**
   * Delete user from Firestore
   */
  async delete(email) {
    try {
      const db = admin.firestore();
      await db.collection(USERS_COLLECTION).doc(email.toLowerCase()).delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  /**
   * Search users with filters and pagination
   */
  async search(query = {}, skip = 0, limit = 20) {
    try {
      const db = admin.firestore();
      let queryRef = db.collection(USERS_COLLECTION);

      // If we have a role filter, apply it
      if (query.role) {
        queryRef = queryRef.where('role', '==', query.role);
      }

      // If we have a search query (q)
      if (query.q) {
        // If we also have a role filter, we need to handle this carefully
        // because Firestore has limitations on complex queries
        if (query.role) {
          // Get all users with the role, then filter by name in memory
          const snapshot = await queryRef.get();
          const filtered = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            const searchStr = query.q.toLowerCase();
            if (
              (data.firstName && data.firstName.toLowerCase().includes(searchStr)) ||
              (data.lastName && data.lastName.toLowerCase().includes(searchStr)) ||
              (data.email && data.email.toLowerCase().includes(searchStr))
            ) {
              filtered.push(new User(data).getPublicProfile());
            }
          });
          const paginatedResults = filtered.slice(skip, skip + limit);
          return { data: paginatedResults, total: filtered.length, skip, limit };
        } else {
          // Just search by name without role filter
          queryRef = queryRef
            .where('firstName', '>=', query.q)
            .where('firstName', '<=', query.q + '\\uf8ff');
        }
      }

      // Get total count
      const countSnapshot = await queryRef.count().get();
      const total = countSnapshot.data().count;

      // Get paginated results
      const snapshot = await queryRef
        .offset(skip)
        .limit(limit)
        .get();

      const users = [];
      snapshot.forEach((doc) => {
        const user = new User(doc.data());
        users.push(user.getPublicProfile());
      });

      return { data: users, total, skip, limit };
    } catch (error) {
      console.error('Search error:', error);
      throw new Error(`Error searching users: ${error.message}`);
    }
  }

  /**
   * Get all users
   */
  async findAll() {
    try {
      const db = admin.firestore();
      const snapshot = await db.collection(USERS_COLLECTION).get();
      const users = [];
      snapshot.forEach((doc) => {
        users.push(new User(doc.data()));
      });
      return users;
    } catch (error) {
      throw new Error(`Error finding all users: ${error.message}`);
    }
  }

  /**
   * Helper: Convert User instance to Firestore-safe data
   */
  _prepareForFirestore(user) {
    return {
      id: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      phoneVerifiedAt: user.phoneVerifiedAt,
      googleId: user.googleId,
      facebookId: user.facebookId,
      profile: user.profile,
      skills: user.skills || [],
      documents: user.documents || [],
      preferences: user.preferences,
      resetPasswordToken: user.resetPasswordToken,
      resetPasswordExpire: user.resetPasswordExpire,
      emailVerificationToken: user.emailVerificationToken,
      emailVerificationExpire: user.emailVerificationExpire,
      lastLogin: user.lastLogin,
      isActive: user.isActive,
      firebaseStoragePath: user.firebaseStoragePath,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

module.exports = new UserRepository();
