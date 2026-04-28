const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send verification email
  async sendVerificationEmail(email, firstName, verificationToken) {
    const verificationLink = `${process.env.CLIENT_URL}/api/auth/verify-email-link?email=${encodeURIComponent(email)}&token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your GIEA Platform Account',
      html: `
        <h2>Welcome to GIEA Platform, ${firstName}!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>Or copy this link: ${verificationLink}</p>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  // ============================================
  // ❌ OLD PASSWORD RESET EMAIL (COMMENTED OUT - DO NOT USE)
  // ============================================
  /*
  // Old password reset email using token link
  async sendPasswordResetEmail(email, firstName, resetToken) {
    const resetLink = `http://localhost:5000/api/auth/verify-password-reset?email=${encodeURIComponent(email)}&token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your GIEA Platform Password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${firstName},</p>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verify & Reset Password
        </a>
        <p>Or copy this link: ${resetLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
  */

  // Send welcome email
  async sendWelcomeEmail(email, firstName) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to GIEA Platform!',
      html: `
        <h2>Welcome, ${firstName}!</h2>
        <p>Your account has been successfully created.</p>
        <p>You can now log in and start exploring all the features of the GIEA Platform.</p>
        <p>Best regards,<br/>GIEA Platform Team</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  // ============================================
  // ✅ NEW OTP-BASED PASSWORD RESET EMAIL
  // ============================================
  // Send password reset OTP email
  async sendPasswordResetOTPEmail(email, firstName, otp) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your GIEA Platform Password Reset OTP',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${firstName},</p>
        <p>You requested to reset your password. Here is your OTP (One-Time Password):</p>
        <h1 style="background-color: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px; border-radius: 5px;">
          ${otp}
        </h1>
        <p><strong>Important:</strong> This OTP is valid for only 10 minutes.</p>
        <p>Enter this OTP in your app to proceed with resetting your password.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr/>
        <p><small>GIEA Platform Team</small></p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  // Send notification email
  async sendNotificationEmail(email, subject, message) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: message,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();
