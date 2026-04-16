const authService = require('../services/auth.service');
const TokenService = require('../services/token.service');
const { validationResult } = require('express-validator');

/**
 * AuthController - Only handles HTTP request/response
 * All business logic is delegated to AuthService
 */

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, role = 'student' } = req.body;

    const user = await authService.register({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { email, token } = req.body;

    const user = await authService.verifyEmail(email, token);

    res.json({
      message: 'Email verified successfully. You can now log in.',
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handle email verification from clickable link in email
 */
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

    const user = await authService.verifyEmail(email, token);

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

    let errorTitle = 'Verification Failed';
    let errorMessage = 'An error occurred during email verification.';

    if (error.message === 'User not found') {
      errorTitle = 'User Not Found';
      errorMessage = 'No account found for this email.';
    } else if (error.message === 'Email already verified') {
      errorTitle = 'Email Already Verified';
      errorMessage = 'Your email has already been verified.';
    } else if (error.message === 'Invalid verification token') {
      errorTitle = 'Invalid Token';
      errorMessage = 'The verification token is invalid or incorrect.';
    } else if (error.message === 'Verification token has expired') {
      errorTitle = 'Token Expired';
      errorMessage = 'Your verification token has expired. Please request a new one.';
    }

    return res.status(400).send(`
      <html>
        <head><title>${errorTitle}</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #d32f2f;">${errorTitle}</h1>
          <p>${errorMessage}</p>
          <a href="http://localhost:3000/login" style="color: #1976d2;">Go to Login</a>
        </body>
      </html>
    `);
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message || 'Invalid email or password' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
        error: 'Missing email field',
      });
    }

    await authService.forgotPassword(email);

    // Always return success message (for security)
    res.json({
      message: 'If an account with that email exists, a password reset link has been sent to it',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    // Always return success for security
    res.json({
      message: 'If an account with that email exists, a password reset link has been sent to it',
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({
        message: 'Email, token, and new password are required',
        error: 'Missing required fields',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long',
        error: 'Invalid password',
      });
    }

    await authService.resetPassword(email, token, newPassword);

    res.json({
      message: 'Password has been reset successfully. You can now log in with your new password',
      success: true,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await require('../repositories/user.repository').findByEmail(req.user.userId);

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
