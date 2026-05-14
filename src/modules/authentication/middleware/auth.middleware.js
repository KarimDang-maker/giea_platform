const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findByEmail(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: 'Compte désactivé' });
    }

    if (user.statusAccount === 'en_attente') {
      return res.status(403).json({ message: 'Compte en attente d\'approbation' });
    }

    if (user.statusAccount === 'suspendu') {
      return res.status(403).json({ message: 'Compte suspendu' });
    }

    if (user.statusAccount === 'supprimé') {
      return res.status(403).json({ message: 'Compte supprimé' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
    // Optional auth, so we don't reject
  }

  next();
};

module.exports = { authMiddleware, optionalAuth };
