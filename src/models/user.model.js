const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

const USERS_COLLECTION = 'users';

class User {
  constructor(data = {}) {
    this.id = data.id || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.phone = data.phone || '';
    this.avatar = data.avatar || '';
    this.role = data.role || 'student';
    
    // Verification
    this.isVerified = data.isVerified || false;
    this.emailVerifiedAt = data.emailVerifiedAt || null;
    this.phoneVerifiedAt = data.phoneVerifiedAt || null;
    
    // OAuth IDs
    this.googleId = data.googleId || '';
    this.facebookId = data.facebookId || '';
    
    // Profile
    this.profile = data.profile || {
      bio: '',
      company: '',
      location: '',
      website: '',
      specialization: '',
      yearsOfExperience: 0,
    };
    
    // Preferences
    this.preferences = data.preferences || {
      emailNotifications: true,
      smsNotifications: false,
      privateProfile: false,
    };
    
    // Security tokens
    this.resetPasswordToken = data.resetPasswordToken || '';
    this.resetPasswordExpire = data.resetPasswordExpire || null;
    this.emailVerificationToken = data.emailVerificationToken || '';
    this.emailVerificationExpire = data.emailVerificationExpire || null;
    
    // Activity & Status
    this.lastLogin = data.lastLogin || null;
    this.isActive = data.isActive !== false ? true : false;
    
    // Storage
    this.firebaseStoragePath = data.firebaseStoragePath || '';
    
    // Timestamps
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Hash password before saving
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Compare passwords
  async comparePassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  // Get public profile (exclude sensitive data)
  getPublicProfile() {
    const profile = { ...this };
    delete profile.password;
    delete profile.resetPasswordToken;
    delete profile.resetPasswordExpire;
    delete profile.emailVerificationToken;
    delete profile.emailVerificationExpire;
    return profile;
  }

  // Save user to Firestore
  async save() {
    try {
      const db = admin.firestore();
      const userRef = db.collection(USERS_COLLECTION).doc(this.email);
      
      // Hash password if it's new or changed
      if (this.password && !this.password.startsWith('$2')) {
        await this.hashPassword();
      }

      this.updatedAt = new Date();

      const userData = {
        id: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        phone: this.phone,
        avatar: this.avatar,
        role: this.role,
        isVerified: this.isVerified,
        emailVerifiedAt: this.emailVerifiedAt,
        phoneVerifiedAt: this.phoneVerifiedAt,
        googleId: this.googleId,
        facebookId: this.facebookId,
        profile: this.profile,
        preferences: this.preferences,
        resetPasswordToken: this.resetPasswordToken,
        resetPasswordExpire: this.resetPasswordExpire,
        emailVerificationToken: this.emailVerificationToken,
        emailVerificationExpire: this.emailVerificationExpire,
        lastLogin: this.lastLogin,
        isActive: this.isActive,
        firebaseStoragePath: this.firebaseStoragePath,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };

      await userRef.set(userData, { merge: true });
      this.id = this.email;
      return this;
    } catch (error) {
      throw new Error(`Error saving user: ${error.message}`);
    }
  }

  // Static method: Find user by email
  static async findByEmail(email) {
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

  // Static method: Find user by ID (email)
  static async findById(id) {
    return this.findByEmail(id);
  }

  // Static method: Create new user
  static async create(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Static method: Find by Google ID
  static async findByGoogleId(googleId) {
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

  // Static method: Find by Facebook ID
  static async findByFacebookId(facebookId) {
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

  // Static method: Search users
  static async search(query = {}, skip = 0, limit = 20) {
    try {
      const db = admin.firestore();
      let queryRef = db.collection(USERS_COLLECTION);

      // Add filters based on query
      if (query.role) {
        queryRef = queryRef.where('role', '==', query.role);
      }

      if (query.q) {
        // For text search, we need to search multiple fields
        // This is a simple implementation; for production use Algolia or similar
        queryRef = queryRef
          .where('firstName', '>=', query.q)
          .where('firstName', '<', query.q + '\uf8ff');
      }

      // Get total count
      const countSnapshot = await queryRef.count().get();
      const total = countSnapshot.data().count;

      // Get paginated results
      let snapshot = await queryRef
        .offset(skip)
        .limit(limit)
        .get();

      const users = [];
      snapshot.forEach((doc) => {
        users.push(new User(doc.data()).getPublicProfile());
      });

      return { data: users, total, skip, limit };
    } catch (error) {
      throw new Error(`Error searching users: ${error.message}`);
    }
  }

  // Static method: Update user
  static async update(email, updateData) {
    try {
      const db = admin.firestore();
      updateData.updatedAt = new Date();

      await db.collection(USERS_COLLECTION).doc(email.toLowerCase()).update(updateData);
      return this.findByEmail(email);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Static method: Delete user
  static async delete(email) {
    try {
      const db = admin.firestore();
      await db.collection(USERS_COLLECTION).doc(email.toLowerCase()).delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // Check if email exists
  static async emailExists(email) {
    try {
      const user = await this.findByEmail(email);
      return user !== null;
    } catch (error) {
      throw new Error(`Error checking email: ${error.message}`);
    }
  }
}

module.exports = User;
