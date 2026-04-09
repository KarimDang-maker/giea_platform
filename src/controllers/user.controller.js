const User = require('../modules/authentication/models/user.model');
const { validationResult } = require('express-validator');
const admin = require('firebase-admin');

exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, phone, bio, company, location, website, specialization } =
      req.body;

    const user = await User.findByEmail(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;

    // Update profile nested object
    if (bio || company || location || website || specialization) {
      const profile = { ...user.profile };
      if (bio) profile.bio = bio;
      if (company) profile.company = company;
      if (location) profile.location = location;
      if (website) profile.website = website;
      if (specialization) profile.specialization = specialization;
      updateData.profile = profile;
    }

    const updatedUser = await User.update(user.email, updateData);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser.getPublicProfile(),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByEmail(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    try {
      // Upload to Firebase Storage
      const bucket = admin.storage().bucket();
      const fileName = `avatars/${user.email}-${Date.now()}-${req.file.originalname}`;
      const file = bucket.file(fileName);

      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      const [downloadURL] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes public URL validity
      });

      // Update user with new avatar
      const updatedUser = await User.update(user.email, {
        avatar: downloadURL,
        firebaseStoragePath: fileName,
      });

      if (!updatedUser) {
        return res.status(500).json({ message: 'Failed to update user profile' });
      }

      res.json({
        message: 'Avatar uploaded successfully',
        avatar: downloadURL,
      });
    } catch (firebaseError) {
      console.error('Firebase storage error:', firebaseError);
      throw firebaseError;
    }
  } catch (error) {
    console.error('Upload avatar error:', error.message, error);
    res.status(500).json({ message: 'Server error uploading avatar', error: error.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, privateProfile } = req.body;

    const user = await User.findByEmail(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const preferences = { ...user.preferences };
    if (emailNotifications !== undefined) preferences.emailNotifications = emailNotifications;
    if (smsNotifications !== undefined) preferences.smsNotifications = smsNotifications;
    if (privateProfile !== undefined) preferences.privateProfile = privateProfile;

    await User.update(user.email, { preferences });

    res.json({
      message: 'Preferences updated successfully',
      preferences,
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error updating preferences' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await User.findByEmail(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await user.comparePassword(currentPassword);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const newUser = new User({ ...user, password: newPassword });
    await newUser.hashPassword();

    await User.update(user.email, { password: newUser.password });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByEmail(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hide personal info if profile is private
    const publicProfile = user.getPublicProfile();
    if (user.preferences.privateProfile && userId !== req.user.userId) {
      delete publicProfile.email;
      delete publicProfile.phone;
    }

    res.json(publicProfile);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error retrieving user' });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q, role, skip = 0, limit = 20 } = req.query;

    const query = {};
    if (q) {
      query.q = q;
    }
    if (role) {
      query.role = role;
    }

    const result = await User.search(query, parseInt(skip), parseInt(limit));

    res.json(result);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error searching users' });
  }
};

exports.deactivateAccount = async (req, res) => {
  try {
    const user = await User.findByEmail(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.update(user.email, { isActive: false });

    res.clearCookie('token');
    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({ message: 'Server error deactivating account' });
  }
};

// ========== SKILLS MANAGEMENT ==========

exports.addSkill = async (req, res) => {
  try {
    const { name, level, yearsOf, category } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    const user = await User.findByEmail(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skill = {
      id: `skill-${Date.now()}`,
      name,
      level: level || 'Intermediate', // 'Beginner', 'Intermediate', 'Advanced', 'Expert'
      yearsOf: yearsOf || 0,
      category: category || 'Other',
      addedAt: new Date(),
    };

    const skills = [...(user.skills || []), skill];
    await User.update(user.email, { skills });

    res.status(201).json({
      message: 'Skill added successfully',
      skill,
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ message: 'Server error adding skill' });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { name, level, yearsOf, category } = req.body;

    const user = await User.findByEmail(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if skills array exists
    if (!user.skills || !Array.isArray(user.skills)) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const skillIndex = user.skills.findIndex((s) => s.id === skillId);
    if (skillIndex === -1) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const updatedSkill = { ...user.skills[skillIndex] };
    if (name) updatedSkill.name = name;
    if (level) updatedSkill.level = level;
    if (yearsOf !== undefined) updatedSkill.yearsOf = yearsOf;
    if (category) updatedSkill.category = category;
    updatedSkill.updatedAt = new Date();

    const skills = [...user.skills];
    skills[skillIndex] = updatedSkill;

    await User.update(user.email, { skills });

    res.json({
      message: 'Skill updated successfully',
      skill: updatedSkill,
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ message: 'Server error updating skill' });
  }
};

exports.removeSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const user = await User.findByEmail(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if skills array exists
    if (!user.skills || !Array.isArray(user.skills)) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const skills = user.skills.filter((s) => s.id !== skillId);

    await User.update(user.email, { skills });

    res.json({
      message: 'Skill removed successfully',
    });
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({ message: 'Server error removing skill' });
  }
};

exports.getSkills = async (req, res) => {
  try {
    const user = await User.findByEmail(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      skills: user.skills || [],
      total: (user.skills || []).length,
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Server error retrieving skills' });
  }
};

// ========== DOCUMENTS MANAGEMENT ==========

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { documentType } = req.body;

    const user = await User.findByEmail(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Upload to Firebase Storage
    const bucket = admin.storage().bucket();
    const fileName = `documents/${user.email}/${documentType || 'document'}-${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Generate permanent signed URL (longer expiration)
    const [downloadURL] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    const document = {
      id: `doc-${Date.now()}`,
      name: req.file.originalname.split('.')[0], // Filename without extension
      type: documentType || 'document', // 'resume', 'certificate', 'portfolio', etc.
      url: downloadURL,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      firebaseStoragePath: fileName,
      uploadedAt: new Date(),
    };

    const documents = [...(user.documents || []), document];
    await User.update(user.email, { documents });

    res.status(201).json({
      message: 'Document uploaded successfully',
      document,
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ message: 'Server error uploading document' });
  }
};

exports.removeDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const user = await User.findByEmail(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if documents array exists
    if (!user.documents || !Array.isArray(user.documents)) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const document = user.documents.find((d) => d.id === documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete from Firebase Storage
    try {
      const bucket = admin.storage().bucket();
      await bucket.file(document.firebaseStoragePath).delete();
    } catch (storageError) {
      console.warn('Warning: Could not delete file from storage:', storageError);
      // Don't fail the request, just log warning
    }

    const documents = user.documents.filter((d) => d.id !== documentId);
    await User.update(user.email, { documents });

    res.json({
      message: 'Document removed successfully',
    });
  } catch (error) {
    console.error('Remove document error:', error);
    res.status(500).json({ message: 'Server error removing document' });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const user = await User.findByEmail(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      documents: user.documents || [],
      total: (user.documents || []).length,
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Server error retrieving documents' });
  }
};

exports.updateDocumentInfo = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { name, type } = req.body;

    const user = await User.findByEmail(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if documents array exists
    if (!user.documents || !Array.isArray(user.documents)) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const documentIndex = user.documents.findIndex((d) => d.id === documentId);
    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const updatedDocument = { ...user.documents[documentIndex] };
    if (name) updatedDocument.name = name;
    if (type) updatedDocument.type = type;
    updatedDocument.updatedAt = new Date();

    const documents = [...user.documents];
    documents[documentIndex] = updatedDocument;

    await User.update(user.email, { documents });

    res.json({
      message: 'Document info updated successfully',
      document: updatedDocument,
    });
  } catch (error) {
    console.error('Update document info error:', error);
    res.status(500).json({ message: 'Server error updating document info' });
  }
};
