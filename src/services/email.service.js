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
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

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

  // Send password reset email
  async sendPasswordResetEmail(email, firstName, resetToken) {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your GIEA Platform Password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${firstName},</p>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>Or copy this link: ${resetLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

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
