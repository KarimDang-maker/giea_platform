const authService = require('../services/auth.service');
const TokenService = require('../services/token.service');
const { validationResult } = require('express-validator');
const { notify } = require('../../notifications/middlewares/notify');

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

    // Appel de la notification sans await (non-bloquant)
    notify(user.id || user.uid || user._id);

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

/**
 * ============================================
 * ✅ NEW OTP-BASED PASSWORD RESET IMPLEMENTATION
 * ============================================
 */

/**
 * Step 1: Request password reset - Send OTP via email
 * Stores email in session for Steps 2 & 3
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
        error: 'Missing email field',
      });
    }

    await authService.forgotPasswordOTP(email);

    // Store email in session for subsequent steps
    req.session.resetEmail = email;

    // Always return success message (for security)
    res.json({
      message: 'If an account with that email exists, a password reset OTP has been sent to it',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    // Always return success for security
    res.json({
      message: 'If an account with that email exists, a password reset OTP has been sent to it',
    });
  }
};

/**
 * Step 2: Verify OTP entered by user
 * Gets email from session (Step 1), only requires OTP from user
 */
exports.verifyPasswordOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.session.resetEmail;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP is required',
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Session expired. Please start password reset again.',
      });
    }

    // Verify OTP
    await authService.verifyPasswordOTP(email, otp);

    // Store verified OTP in session for Step 3
    req.session.verifiedOTP = otp;

    res.json({
      success: true,
      message: 'OTP verified successfully. You can now reset your password.',
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Step 3: Reset password after OTP verification
 * Gets email & OTP from session, only requires new password from user
 */
exports.resetPasswordWithOTP = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const email = req.session.resetEmail;
    const otp = req.session.verifiedOTP;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and password confirmation are required',
      });
    }

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Session expired. Please start password reset again.',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    // Reset password
    await authService.resetPasswordWithOTP(email, otp, newPassword);

    // Clear session data
    delete req.session.resetEmail;
    delete req.session.verifiedOTP;

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ============================================
 * ❌ OLD TOKEN-BASED IMPLEMENTATION (COMMENTED OUT - DO NOT USE)
 * ============================================
 */

/*
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

// Verify password reset token from email link (WEB - redirect to app)
// Works exactly like email verification - click link → verify → redirect to app with token
// App then shows password form (only password + confirm fields)
exports.verifyPasswordResetLink = async (req, res) => {
  try {
    const { email, token } = req.query;

    if (!email || !token) {
      return res.status(400).send(`
        <html>
          <head><title>Password Reset Failed</title></head>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1 style="color: #d32f2f;">Password Reset Failed</h1>
            <p>Email and reset token are required.</p>
            <a href="${process.env.CLIENT_URL}/login" style="color: #1976d2;">Go to Login</a>
          </body>
        </html>
      `);
    }

    // Verify token is valid
    await authService.verifyPasswordReset(email, token);

    // Token is valid - redirect to app with email and token in URL
    // App will capture these and show password reset form
    const resetPageUrl = `${process.env.CLIENT_URL}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
    
    return res.redirect(resetPageUrl);
  } catch (error) {
    console.error('Password reset link verification error:', error);

    let errorTitle = 'Verification Failed';
    let errorMessage = 'An error occurred during password reset verification.';
    let redirectUrl = `${process.env.CLIENT_URL}/login?error=password_reset_failed`;

    if (error.message === 'User not found') {
      errorTitle = 'User Not Found';
      errorMessage = 'No account found for this email.';
      redirectUrl = `${process.env.CLIENT_URL}/login?error=user_not_found`;
    } else if (error.message === 'Password reset token has already been used or expired') {
      errorTitle = 'Token Already Used';
      errorMessage = 'This password reset token has already been used. Please request a new password reset.';
      redirectUrl = `${process.env.CLIENT_URL}/login?error=token_already_used`;
    } else if (error.message === 'Invalid reset token') {
      errorTitle = 'Invalid Token';
      errorMessage = 'The password reset token is invalid or incorrect.';
      redirectUrl = `${process.env.CLIENT_URL}/login?error=invalid_token`;
    } else if (error.message === 'Password reset token has expired') {
      errorTitle = 'Token Expired';
      errorMessage = 'Your password reset token has expired. Please request a new one.';
      redirectUrl = `${process.env.CLIENT_URL}/login?error=token_expired`;
    }

    // Show error page briefly, then redirect to login
    return res.send(`
      <html>
        <head>
          <title>${errorTitle}</title>
          <script>
            setTimeout(() => {
              window.location.href = '${redirectUrl}';
            }, 3000);
          </script>
        </head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #d32f2f;">${errorTitle}</h1>
          <p>${errorMessage}</p>
          <p style="color: #666; margin-top: 30px;">Redirecting to login in 3 seconds...</p>
          <a href="${redirectUrl}" style="color: #1976d2;">Click here if not redirected</a>
        </body>
      </html>
    `);
  }
};

// Verify password reset token (MOBILE - returns JSON)
// Used by mobile apps after user clicks the verification link in email
exports.verifyPasswordResetToken = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({
        success: false,
        message: 'Email and reset token are required',
      });
    }

    // Verify the token
    await authService.verifyPasswordReset(email, token);

    // Return success - user can now reset password
    res.json({
      success: true,
      message: 'Password reset token verified successfully. You can now reset your password.',
      token: token, // Echo back token for mobile app to use in next request
    });
  } catch (error) {
    console.error('Password reset token verification error:', error);

    let statusCode = 400;
    let errorMessage = error.message || 'An error occurred during password reset verification';

    if (error.message === 'User not found') {
      statusCode = 404;
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

// Reset password from HTML form (WEB - Form submission)
// Called when user submits password reset form from the email verification page
exports.resetPasswordFromLink = async (req, res) => {
  try {
    const { email, token, newPassword, confirmPassword } = req.body;

    if (!email || !token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, reset token, new password, and password confirmation are required',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    // Reset password
    await authService.resetPassword(token, newPassword, email);

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password',
    });
  } catch (error) {
    console.error('Reset password from link error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    
    // Get token from multiple sources (in priority order):
    // 1. Request body
    // 2. Authorization header (Bearer token)
    // 3. URL query parameter
    let token = req.body.token;
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token, new password, and password confirmation are required',
        error: 'Missing required fields',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
        error: 'Password mismatch',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
        error: 'Invalid password',
      });
    }

    // Call service with email if provided (mobile flow)
    await authService.resetPassword(token, newPassword, email);

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
*/

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
