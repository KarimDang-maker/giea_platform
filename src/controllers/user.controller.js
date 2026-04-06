const User = require('../models/user.model');
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
    await User.update(user.email, {
      avatar: downloadURL,
      firebaseStoragePath: fileName,
    });

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: downloadURL,
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Server error uploading avatar' });
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
