const bcrypt = require('bcryptjs');

/**
 * User Data Model - Data only (no database operations)
 * Purpose: Represent user data with validation and methods
 * Database operations are handled by UserRepository
 */
class User {
  constructor(data = {}) {
    // Basic Info
    this.id = data.id || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.phone = data.phone || '';
    this.avatar = data.avatar || '';
    this.role = data.role || ['entrepreneur']; // Default role, pour permettre le cumul des roles par un utilisateur
    
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

    // Skills & Documents
    this.skills = data.skills || [];
    this.documents = data.documents || [];
    
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
    
    // OTP for password reset (new OTP-based implementation)
    this.resetPasswordOTP = data.resetPasswordOTP || '';
    this.resetPasswordOTPExpire = data.resetPasswordOTPExpire || null;
    
    // Activity & Status
    this.lastLogin = data.lastLogin || null;
    this.statusAccount = data.statusAccount || 'en_attente'; // en_attente | approuvé | suspendu | supprimé
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    
    // Storage
    this.firebaseStoragePath = data.firebaseStoragePath || '';

    //traçabilité admin
    this.validatedBy = data.validatedBy || null;
    this.statusReason = data.statusReason || '';
    this.validatedAt = data.validatedAt || null;
    
    // Champs GIEA
    this.isGieaMember = data.isGieaMember || false;
    this.membershipMessage = data.membershipMessage || '';
    
    // Timestamps
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Hash password using bcrypt
   * Should be called from AuthService or UserRepository
   */
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  /**
   * Compare password with stored hash
   */
  async comparePassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  /**
   * Get public profile (exclude sensitive data)
   */
  getPublicProfile() {
    const profile = { ...this };
    delete profile.password;
    delete profile.resetPasswordToken;
    delete profile.resetPasswordExpire;
    delete profile.resetPasswordOTP;
    delete profile.resetPasswordOTPExpire;
    delete profile.emailVerificationToken;
    delete profile.emailVerificationExpire;
    return profile;
  }

  /**
   * Serialize JSON (used for response)
   */
  toJSON() {
    return this.getPublicProfile();
  }
}

module.exports = User;
