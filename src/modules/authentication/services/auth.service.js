const userRepository = require('../repositories/user.repository');
const TokenService = require('./token.service');
const EmailService = require('./email.service');
const User = require('../models/user.model');

/**
 * AuthService - Handles all authentication business logic
 * Orchestrates: UserRepository + TokenService + EmailService
 */
class AuthService {
  /**
   * Register new user
   */
  async register(userData) {
    try {
      const { firstName, lastName, email, password, role = 'student' } = userData;

      // Check if user already exists
      const userExists = await userRepository.emailExists(email.toLowerCase());
      if (userExists) {
        throw new Error('Email already registered');
      }

      // Create new user
      const user = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password,
        role,
      });

      // Save to database
      const savedUser = await userRepository.create(user);

      // Generate verification token
      const verificationToken = TokenService.generateVerificationToken();
      const hashedToken = TokenService.hashToken(verificationToken);
      const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Update user with verification token
      await userRepository.update(savedUser.email, {
        emailVerificationToken: hashedToken,
        emailVerificationExpire: tokenExpiry,
      });

      // Send verification email (non-blocking)
      try {
        await EmailService.sendVerificationEmail(email, firstName, verificationToken);
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
      }

      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(email, token) {
    try {
      if (!email || !token) {
        throw new Error('Email and verification token are required');
      }

      // Get user
      const user = await userRepository.findByEmail(email.toLowerCase());

      if (!user) {
        throw new Error('User not found');
      }

      if (user.isVerified) {
        throw new Error('Email already verified');
      }

      // Verify token
      if (!TokenService.verifyHashedToken(token, user.emailVerificationToken)) {
        throw new Error('Invalid verification token');
      }

      // Check token expiry
      let expireTime = user.emailVerificationExpire;
      if (expireTime && typeof expireTime.toDate === 'function') {
        expireTime = expireTime.toDate();
      } else if (typeof expireTime === 'string') {
        expireTime = new Date(expireTime);
      }

      if (new Date() > new Date(expireTime)) {
        throw new Error('Verification token has expired');
      }

      // Update user as verified
      const verifiedUser = await userRepository.update(user.email, {
        isVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
        emailVerificationExpire: null,
      });

      // Send welcome email (non-blocking)
      try {
        await EmailService.sendWelcomeEmail(user.email, user.firstName);
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
      }

      return verifiedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const user = await userRepository.findByEmail(email.toLowerCase());

      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await userRepository.update(user.email, {
        lastLogin: new Date(),
      });

      // Generate JWT token
      const token = TokenService.generateToken(user.email, user.role);

      return {
        token,
        user: user.getPublicProfile(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Forgot password - generate reset token
   */
  async forgotPassword(email) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const user = await userRepository.findByEmail(email.toLowerCase());

      if (!user) {
        throw new Error('User not found');
      }

      // Generate reset token
      const resetToken = TokenService.generateResetToken();
      const hashedToken = TokenService.hashToken(resetToken);
      const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Update user with reset token
      await userRepository.update(user.email, {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: tokenExpiry,
      });

      // Send reset email (non-blocking)
      try {
        await EmailService.sendPasswordResetEmail(email, user.firstName, resetToken);
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);
      }

      return { message: 'Password reset email sent' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify password reset token
   */
  async verifyPasswordReset(email, token) {
    try {
      if (!email || !token) {
        throw new Error('Email and reset token are required');
      }

      const user = await userRepository.findByEmail(email.toLowerCase());

      if (!user) {
        throw new Error('User not found');
      }

      // Check if reset token exists (already used or expired)
      if (!user.resetPasswordToken) {
        throw new Error('Password reset token has already been used or expired');
      }

      // Verify reset token
      if (!TokenService.verifyHashedToken(token, user.resetPasswordToken)) {
        throw new Error('Invalid reset token');
      }

      // Check token expiry
      let expireTime = user.resetPasswordExpire;
      if (expireTime && typeof expireTime.toDate === 'function') {
        expireTime = expireTime.toDate();
      } else if (typeof expireTime === 'string') {
        expireTime = new Date(expireTime);
      }

      if (new Date() > new Date(expireTime)) {
        throw new Error('Password reset token has expired');
      }

      return { message: 'Password reset token verified successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password after token verification (Mobile & Web)
   * For mobile apps: email is provided directly
   * For web: email was already verified in a previous step
   */
  async resetPassword(token, newPassword, email = null) {
    try {
      if (!token || !newPassword) {
        throw new Error('Reset token and new password are required');
      }

      let user = null;

      // If email is provided (mobile app flow), use it directly
      if (email) {
        user = await userRepository.findByEmail(email.toLowerCase());
        if (!user) {
          throw new Error('User not found');
        }
      } else {
        // Find user by reset token (web flow)
        const users = await userRepository.findAll();
        for (const u of users) {
          if (u.resetPasswordToken && TokenService.verifyHashedToken(token, u.resetPasswordToken)) {
            user = u;
            break;
          }
        }
      }

      if (!user) {
        throw new Error('Invalid or expired password reset token. Please request a new password reset.');
      }

      // Verify token is valid
      if (!user.resetPasswordToken) {
        throw new Error('Password reset token has already been used or expired');
      }

      if (!TokenService.verifyHashedToken(token, user.resetPasswordToken)) {
        throw new Error('Invalid password reset token');
      }

      // Check token expiry
      let expireTime = user.resetPasswordExpire;
      if (expireTime && typeof expireTime.toDate === 'function') {
        expireTime = expireTime.toDate();
      } else if (typeof expireTime === 'string') {
        expireTime = new Date(expireTime);
      }

      if (new Date() > new Date(expireTime)) {
        throw new Error('Password reset token has expired. Please request a new password reset.');
      }

      // Hash new password
      const newUser = new User({ password: newPassword });
      await newUser.hashPassword();

      // Update password
      const updatedUser = await userRepository.update(user.email, {
        password: newUser.password,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Google OAuth callback
   */
  async handleGoogleCallback(profile) {
    try {
      let user = await userRepository.findByGoogleId(profile.id);

      if (!user) {
        // Check if email exists
        const emailExists = await userRepository.emailExists(profile.emails[0].value);

        if (emailExists) {
          user = await userRepository.findByEmail(profile.emails[0].value);
          // Link Google ID to existing user
          await userRepository.update(user.email, {
            googleId: profile.id,
          });
        } else {
          // Create new user from Google profile
          user = await userRepository.create({
            firstName: profile.name.givenName || profile.name.familyName || 'User',
            lastName: profile.name.familyName || '',
            email: profile.emails[0].value,
            googleId: profile.id,
            isVerified: true,
            emailVerifiedAt: new Date(),
            avatar: profile.photos[0]?.value || '',
          });
        }
      }

      const token = TokenService.generateToken(user.email, user.role);

      return {
        token,
        user: user.getPublicProfile(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Facebook OAuth removed - no longer supported
   */

  /**
   * ============================================
   * ✅ NEW OTP-BASED PASSWORD RESET IMPLEMENTATION
   * ============================================
   */

  /**
   * Generate and send OTP for password reset
   */
  async forgotPasswordOTP(email) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const user = await userRepository.findByEmail(email.toLowerCase());

      if (!user) {
        throw new Error('User not found');
      }

      // Generate OTP (6-digit random number)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOTP = TokenService.hashToken(otp);
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Update user with OTP
      await userRepository.update(user.email, {
        resetPasswordOTP: hashedOTP,
        resetPasswordOTPExpire: otpExpiry,
      });

      // Send OTP email (non-blocking)
      try {
        await EmailService.sendPasswordResetOTPEmail(email, user.firstName, otp);
      } catch (emailError) {
        console.error('Error sending password reset OTP email:', emailError);
      }

      return { message: 'Password reset OTP sent' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify OTP for password reset
   */
  async verifyPasswordOTP(email, otp) {
    try {
      if (!email || !otp) {
        throw new Error('Email and OTP are required');
      }

      const user = await userRepository.findByEmail(email.toLowerCase());

      if (!user) {
        throw new Error('User not found');
      }

      // Check if OTP exists
      if (!user.resetPasswordOTP) {
        throw new Error('No OTP found. Please request a new password reset.');
      }

      // Verify OTP
      if (!TokenService.verifyHashedToken(otp, user.resetPasswordOTP)) {
        throw new Error('Invalid OTP');
      }

      // Check OTP expiry
      let expireTime = user.resetPasswordOTPExpire;
      if (expireTime && typeof expireTime.toDate === 'function') {
        expireTime = expireTime.toDate();
      } else if (typeof expireTime === 'string') {
        expireTime = new Date(expireTime);
      }

      if (new Date() > new Date(expireTime)) {
        throw new Error('OTP has expired. Please request a new password reset.');
      }

      return { message: 'OTP verified successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password after OTP verification
   */
  async resetPasswordWithOTP(email, otp, newPassword) {
    try {
      if (!email || !otp || !newPassword) {
        throw new Error('Email, OTP, and new password are required');
      }

      const user = await userRepository.findByEmail(email.toLowerCase());

      if (!user) {
        throw new Error('User not found');
      }

      // Check if OTP exists
      if (!user.resetPasswordOTP) {
        throw new Error('No OTP found. Please request a new password reset.');
      }

      // Verify OTP
      if (!TokenService.verifyHashedToken(otp, user.resetPasswordOTP)) {
        throw new Error('Invalid OTP');
      }

      // Check OTP expiry
      let expireTime = user.resetPasswordOTPExpire;
      if (expireTime && typeof expireTime.toDate === 'function') {
        expireTime = expireTime.toDate();
      } else if (typeof expireTime === 'string') {
        expireTime = new Date(expireTime);
      }

      if (new Date() > new Date(expireTime)) {
        throw new Error('OTP has expired. Please request a new password reset.');
      }

      // Hash new password
      const newUser = new User({ password: newPassword });
      await newUser.hashPassword();

      // Update password and clear OTP
      const updatedUser = await userRepository.update(user.email, {
        password: newUser.password,
        resetPasswordOTP: null,
        resetPasswordOTPExpire: null,
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * ============================================
   * ❌ OLD TOKEN-BASED PASSWORD RESET (COMMENTED OUT - DO NOT USE)
   * ============================================
   */

  /*
  async forgotPassword(email) {
    // Old implementation using tokens - replaced by forgotPasswordOTP()
  }

  async verifyPasswordReset(email, token) {
    // Old implementation using tokens - no longer used
  }

  async resetPassword(token, newPassword, email = null) {
    // Old implementation using tokens - replaced by resetPasswordWithOTP()
  }
  */
}

module.exports = new AuthService();
