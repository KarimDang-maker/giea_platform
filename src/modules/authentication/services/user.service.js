const admin = require('firebase-admin');
const userRepository = require('../repositories/user.repository');
const User = require('../models/user.model');

/**
 * UserService - Handles user profile, skills, and document operations
 * Orchestrates: UserRepository + Firebase Storage
 */
class UserService {
  /**
   * Update user profile
   */
  async updateProfile(userId, profileData) {
    try {
      const { firstName, lastName, phone, bio, company, location, website, specialization, yearsOfExperience } =
        profileData;

      const user = await userRepository.findByEmail(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Prepare update data
      const updateData = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (phone !== undefined) updateData.phone = phone;

      // Update profile nested object
      if (bio !== undefined || company !== undefined || location !== undefined || website !== undefined || specialization !== undefined || yearsOfExperience !== undefined) {
        const profile = user.profile ? { ...user.profile } : {};
        if (bio !== undefined) profile.bio = bio;
        if (company !== undefined) profile.company = company;
        if (location !== undefined) profile.location = location;
        if (website !== undefined) profile.website = website;
        if (specialization !== undefined) profile.specialization = specialization;
        if (yearsOfExperience !== undefined) profile.yearsOfExperience = yearsOfExperience;
        updateData.profile = profile;
      }

      const updatedUser = await userRepository.update(user.email, updateData);

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(userId, file) {
    try {
      if (!file) {
        throw new Error('No file uploaded');
      }

      const user = await userRepository.findByEmail(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Upload to Firebase Storage
      const bucket = admin.storage().bucket();
      const fileName = `avatars/${user.email}-${Date.now()}-${file.originalname}`;
      const storageFile = bucket.file(fileName);

      await storageFile.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Generate signed URL (valid for 7 days)
      const [downloadURL] = await storageFile.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });

      // Update user with new avatar
      const updatedUser = await userRepository.update(user.email, {
        avatar: downloadURL,
        firebaseStoragePath: fileName,
      });

      return {
        avatar: downloadURL,
        user: updatedUser,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId, preferences) {
    try {
      const { emailNotifications, smsNotifications, privateProfile } = preferences;

      const user = await userRepository.findByEmail(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const prefs = user.preferences ? { ...user.preferences } : {};
      if (emailNotifications !== undefined) prefs.emailNotifications = emailNotifications;
      if (smsNotifications !== undefined) prefs.smsNotifications = smsNotifications;
      if (privateProfile !== undefined) prefs.privateProfile = privateProfile;

      const updatedUser = await userRepository.update(user.email, { preferences: prefs });

      return updatedUser;
    } catch (error) {
      console.error('updatePreferences error:', error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      if (!currentPassword || !newPassword) {
        throw new Error('Current and new passwords are required');
      }

      const user = await userRepository.findByEmail(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await user.comparePassword(currentPassword);

      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const newUser = new User({ password: newPassword });
      await newUser.hashPassword();

      // Update password
      const updatedUser = await userRepository.update(user.email, {
        password: newUser.password,
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId, requestingUserId = null) {
    try {
      const user = await userRepository.findByEmail(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Hide personal info if profile is private
      const publicProfile = user.getPublicProfile();
      if (user.preferences && user.preferences.privateProfile && userId !== requestingUserId) {
        delete publicProfile.email;
        delete publicProfile.phone;
      }

      return publicProfile;
    } catch (error) {
      console.error('getUserById error:', error);
      throw error;
    }
  }

  /**
   * Search users
   */
  async searchUsers(query, skip = 0, limit = 20) {
    try {
      const searchQuery = {};
      if (query && query.q) searchQuery.q = query.q;
      if (query && query.role) searchQuery.role = query.role;

      const result = await userRepository.search(searchQuery, parseInt(skip), parseInt(limit));
      return result;
    } catch (error) {
      console.error('searchUsers error:', error);
      throw error;
    }
  }

  /**
   * Deactivate user account
   */
  async deactivateAccount(userId) {
    try {
      const user = await userRepository.findByEmail(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const updatedUser = await userRepository.update(user.email, { isActive: false });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  // ========== SKILLS MANAGEMENT ==========

  /**
   * Add skill to user
   */
  async addSkill(userId, skillData) {
    try {
      const { name, level, yearsOf, category } = skillData;

      if (!name) {
        throw new Error('Skill name is required');
      }

      const user = await userRepository.findByEmail(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const skill = {
        id: `skill-${Date.now()}`,
        name,
        level: level || 'Intermediate',
        yearsOf: yearsOf || 0,
        category: category || 'Other',
        addedAt: new Date(),
      };

      const skills = [...(user.skills || []), skill];
      await userRepository.update(user.email, { skills });

      return skill;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user skills
   */
  async getSkills(userId) {
    try {
      const user = await userRepository.findByEmail(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        skills: user.skills || [],
        total: (user.skills || []).length,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get single skill
   */
  async getSkill(userId, skillId) {
    try {
      const user = await userRepository.findByEmail(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.skills || !Array.isArray(user.skills)) {
        throw new Error('Skill not found');
      }

      const skill = user.skills.find((s) => s.id === skillId);
      if (!skill) {
        throw new Error('Skill not found');
      }

      return skill;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update skill
   */
  async updateSkill(userId, skillId, skillData) {
    try {
      const { name, level, yearsOf, category } = skillData;

      const user = await userRepository.findByEmail(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.skills || !Array.isArray(user.skills)) {
        throw new Error('Skill not found');
      }

      const skillIndex = user.skills.findIndex((s) => s.id === skillId);
      if (skillIndex === -1) {
        throw new Error('Skill not found');
      }

      const updatedSkill = { ...user.skills[skillIndex] };
      if (name) updatedSkill.name = name;
      if (level) updatedSkill.level = level;
      if (yearsOf !== undefined) updatedSkill.yearsOf = yearsOf;
      if (category) updatedSkill.category = category;
      updatedSkill.updatedAt = new Date();

      const skills = [...user.skills];
      skills[skillIndex] = updatedSkill;

      await userRepository.update(user.email, { skills });

      return updatedSkill;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove skill
   */
  async removeSkill(userId, skillId) {
    try {
      const user = await userRepository.findByEmail(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.skills || !Array.isArray(user.skills)) {
        throw new Error('Skill not found');
      }

      const skill = user.skills.find((s) => s.id === skillId);
      if (!skill) {
        throw new Error('Skill not found');
      }

      const skills = user.skills.filter((s) => s.id !== skillId);

      await userRepository.update(user.email, { skills });

      return { message: 'Skill removed successfully' };
    } catch (error) {
      throw error;
    }
  }

  // ========== DOCUMENTS MANAGEMENT ==========

  /**
   * Upload document
   */
  async uploadDocument(userId, file, documentType) {
    try {
      if (!file) {
        throw new Error('No file uploaded');
      }

      const user = await userRepository.findByEmail(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Upload to Firebase Storage
      const bucket = admin.storage().bucket();
      const fileName = `documents/${user.email}/${documentType || 'document'}-${Date.now()}-${file.originalname}`;
      const storageFile = bucket.file(fileName);

      await storageFile.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Generate signed URL (valid for 30 days)
      const [downloadURL] = await storageFile.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });

      // Add document to user's documents array
      const document = {
        id: `doc-${Date.now()}`,
        name: file.originalname,
        type: documentType || 'document',
        url: downloadURL,
        fileName,
        mimeType: file.mimetype,
        fileSize: file.size,
        uploadedAt: new Date(),
      };

      const documents = [...(user.documents || []), document];
      await userRepository.update(user.email, { documents });

      return document;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user documents
   */
  async getDocuments(userId) {
    try {
      const user = await userRepository.findByEmail(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        documents: user.documents || [],
        total: (user.documents || []).length,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove document
   */
  async removeDocument(userId, documentId) {
    try {
      const user = await userRepository.findByEmail(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.documents || !Array.isArray(user.documents)) {
        throw new Error('Document not found');
      }

      const document = user.documents.find((d) => d.id === documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      // Delete from Firebase Storage
      const bucket = admin.storage().bucket();
      try {
        await bucket.file(document.fileName).delete();
      } catch (storageError) {
        console.error('Error deleting file from storage:', storageError);
      }

      // Remove from documents array
      const documents = user.documents.filter((d) => d.id !== documentId);

      await userRepository.update(user.email, { documents });

      return { message: 'Document removed successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
