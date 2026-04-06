const User = require('../models/user.model');
const TokenService = require('../services/token.service');
const EmailService = require('../services/email.service');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, role = 'student' } = req.body;

    // Check if user already exists
    const userExists = await User.emailExists(email.toLowerCase());
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role,
    });

    await user.save();

    // Generate verification token
    const verificationToken = TokenService.generateVerificationToken();
    const hashedToken = TokenService.hashToken(verificationToken);
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with verification token
    await User.update(user.email, {
      emailVerificationToken: hashedToken,
      emailVerificationExpire: tokenExpiry,
    });

    // Send verification email
    try {
      await EmailService.sendVerificationEmail(email, firstName, verificationToken);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
    }

    res.status(201).json({
      message:
        'Registration successful. Please check your email to verify your account.',
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const hashedToken = TokenService.hashToken(token);

    // Since Firestore doesn't have easy query capabilities for text search,
    // we'll need to iterate through users to find the one with the token
    // For production, consider using Algolia or similar
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    const snapshot = await db
      .collection('users')
      .where('emailVerificationToken', '==', hashedToken)
      .where('emailVerificationExpire', '>', new Date())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const user = new User(userData);

    // Update user
    await User.update(user.email, {
      isVerified: true,
      emailVerifiedAt: new Date(),
      emailVerificationToken: '',
      emailVerificationExpire: null,
    });

    // Send welcome email
    try {
      await EmailService.sendWelcomeEmail(user.email, user.firstName);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
    }

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email.toLowerCase());

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    // Update last login
    await User.update(user.email, {
      lastLogin: new Date(),
    });

    const token = TokenService.generateToken(user.email, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Login successful',
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email.toLowerCase());
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    const resetToken = TokenService.generateResetToken();
    const hashedToken = TokenService.hashToken(resetToken);
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    await User.update(user.email, {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: tokenExpiry,
    });

    try {
      await EmailService.sendPasswordResetEmail(email, user.firstName, resetToken);
    } catch (emailError) {
      console.error('Error sending reset email:', emailError);
      return res.status(500).json({ message: 'Error sending reset email' });
    }

    res.json({ message: 'Password reset link has been sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const hashedToken = TokenService.hashToken(token);

    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    const snapshot = await db
      .collection('users')
      .where('resetPasswordToken', '==', hashedToken)
      .where('resetPasswordExpire', '>', new Date())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const user = new User(userData);

    // Update password
    user.password = newPassword;
    await user.hashPassword();

    await User.update(user.email, {
      password: user.password,
      resetPasswordToken: '',
      resetPasswordExpire: null,
    });

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByEmail(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error retrieving user' });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = TokenService.generateToken(user.email, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}/auth-callback?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
  }
};

exports.facebookCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = TokenService.generateToken(user.email, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}/auth-callback?token=${token}`);
  } catch (error) {
    console.error('Facebook callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
  }
};
