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
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days (extended from 24 hours)

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
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ message: 'Email and verification token are required' });
    }

    // Get user by email
    const user = await User.findByEmail(email.toLowerCase());
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Verify token matches
    const hashedToken = require('../services/token.service').hashToken(token);
    
    if (user.emailVerificationToken !== hashedToken) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    // Check if token expired
    if (new Date() > user.emailVerificationExpire) {
      return res.status(400).json({ message: 'Verification token has expired' });
    }

    // Update user as verified
    await User.update(user.email, {
      isVerified: true,
      emailVerifiedAt: new Date(),
      emailVerificationToken: null,
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

// Handle email verification from clickable link in email
exports.verifyEmailLink = async (req, res) => {
  try {
    const { email, token } = req.query;

    if (!email || !token) {
      return res.status(400).send(`
        <html>
          <head><title>Email Verification Failed</title></head>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1 style="color: #d32f2f;">Email Verification Failed</h1>
            <p>Email and verification token are required.</p>
            <a href="http://localhost:3000/login" style="color: #1976d2;">Go to Login</a>
          </body>
        </html>
      `);
    }

    // Get user by email
    const user = await User.findByEmail(email.toLowerCase());
    
    if (!user) {
      return res.status(404).send(`
        <html>
          <head><title>User Not Found</title></head>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1 style="color: #d32f2f;">User Not Found</h1>
            <p>No account found for this email.</p>
            <a href="http://localhost:3000/register" style="color: #1976d2;">Create Account</a>
          </body>
        </html>
      `);
    }

    // Check if already verified
    if (user.isVerified) {
      return res.send(`
        <html>
          <head><title>Email Already Verified</title></head>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1 style="color: #1976d2;">Email Already Verified</h1>
            <p>Your email has already been verified.</p>
            <a href="http://localhost:3000/login" style="color: #1976d2;">Go to Login</a>
          </body>
        </html>
      `);
    }

    // Verify token matches
    const TokenService = require('../services/token.service');
    const hashedToken = TokenService.hashToken(token);
    
    console.log('Email from link:', email);
    console.log('User email:', user.email);
    console.log('Token received:', token.substring(0, 20) + '...');
    console.log('Stored hashed token:', user.emailVerificationToken ? user.emailVerificationToken.substring(0, 20) + '...' : 'NOT SET');
    console.log('Calculated hash:', hashedToken.substring(0, 20) + '...');
    console.log('Token expiry:', user.emailVerificationExpire);
    console.log('Current time:', new Date());
    
    if (user.emailVerificationToken !== hashedToken) {
      console.error('Token mismatch!');
      return res.status(400).send(`
        <html>
          <head><title>Invalid Token</title></head>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1 style="color: #d32f2f;">Invalid Verification Token</h1>
            <p>The verification token is invalid or incorrect.</p>
            <a href="http://localhost:3000/login" style="color: #1976d2;">Go to Login</a>
          </body>
        </html>
      `);
    }

    // Check if token expired - convert to Date if needed
    const expiryDate = user.emailVerificationExpire instanceof Date 
      ? user.emailVerificationExpire 
      : new Date(user.emailVerificationExpire);
    
    if (new Date() > expiryDate) {
      console.error('Token expired!');
      return res.status(400).send(`
        <html>
          <head><title>Token Expired</title></head>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1 style="color: #d32f2f;">Verification Token Expired</h1>
            <p>Your verification token has expired. Please request a new one.</p>
            <a href="http://localhost:3000/login" style="color: #1976d2;">Go to Login</a>
          </body>
        </html>
      `);
    }

    // Update user as verified
    await User.update(user.email, {
      isVerified: true,
      emailVerifiedAt: new Date(),
      emailVerificationToken: null,
      emailVerificationExpire: null,
    });

    // Send welcome email
    try {
      const EmailService = require('../services/email.service');
      await EmailService.sendWelcomeEmail(user.email, user.firstName);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
    }

    return res.send(`
      <html>
        <head><title>Email Verified Successfully</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #4caf50;">Email Verified Successfully!</h1>
          <p>Your email has been verified. You can now log in.</p>
          <a href="http://localhost:3000/login" style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #4caf50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          ">Go to Login</a>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Email verification link error:', error);
    res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #d32f2f;">Server Error</h1>
          <p>An error occurred during email verification.</p>
          <a href="http://localhost:3000/login" style="color: #1976d2;">Go to Login</a>
        </body>
      </html>
    `);
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
