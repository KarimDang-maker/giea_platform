const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class TokenService {
  // Generate JWT token (use email as userId for Firestore)
  static generateToken(userEmail, role, expiresIn = process.env.JWT_EXPIRE || '7d') {
    const payload = {
      userId: userEmail, // Use email as user ID for Firestore lookups
      email: userEmail,
      role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  // Generate verification token
  static generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate reset token
  static generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Verify token
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Hash token for storage
  static hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Verify hashed token
  static verifyHashedToken(token, hashedToken) {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return hash === hashedToken;
  }
}

module.exports = TokenService;
