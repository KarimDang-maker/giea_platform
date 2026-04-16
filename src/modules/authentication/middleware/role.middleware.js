const { defineAbility } = require('@casl/ability');

// Define CASL Rules for each role
const defineRules = (user) => {
  const { can, rules } = defineAbility((can, cannot) => {
    if (!user) return;

    const { role } = user;

    // Student role
    if (role === 'student') {
      can('read', 'Profile', { userId: user.email });
      can('update', 'Profile', { userId: user.email });
      can('read', 'Projects', { studentId: user.email });
      can('create', 'Projects');
      can('update', 'Projects', { studentId: user.email });
      can('read', 'Investments');
      can('read', 'Mentors');
    }

    // Entrepreneur role
    if (role === 'entrepreneur') {
      can('read', 'Profile', { userId: user.email });
      can('update', 'Profile', { userId: user.email });
      can('read', 'Projects');
      can('create', 'Projects');
      can('update', 'Projects', { entrepreneurId: user.email });
      can('delete', 'Projects', { entrepreneurId: user.email });
      can('read', 'Investments', { entrepreneurId: user.email });
      can('read', 'Investors');
      can('read', 'Mentors');
      can('create', 'Messages');
    }

    // Company role
    if (role === 'company') {
      can('read', 'Profile', { userId: user.email });
      can('update', 'Profile', { userId: user.email });
      can('read', 'Projects');
      can('read', 'Entrepreneurs');
      can('read', 'Investors');
      can('create', 'Partnerships');
      can('read', 'Messages');
    }

    // Investor role
    if (role === 'investor') {
      can('read', 'Profile', { userId: user.email });
      can('update', 'Profile', { userId: user.email });
      can('read', 'Projects');
      can('create', 'Investments');
      can('read', 'Investments', { investorId: user.email });
      can('read', 'Entrepreneurs');
      can('read', 'Messages');
    }

    // Mentor role
    if (role === 'mentor') {
      can('read', 'Profile', { userId: user.email });
      can('update', 'Profile', { userId: user.email });
      can('read', 'Projects');
      can('create', 'Feedback');
      can('read', 'Students');
      can('read', 'Messages');
      can('create', 'Messages');
    }

    // Admin role - full access
    if (role === 'admin') {
      can('manage', 'all');
    }
  });

  return { can, rules };
};

// Check ability middleware - simplified for student profile updates
const checkAbility = (action, subject) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.user.role;
    const userEmail = req.user.userId;

    // Special handling for profile updates - users can update their own
    if (action === 'update' && subject === 'Profile') {
      // Allow update if no userId specified (updating own) or userId matches
      const targetUserId = req.params.userId || userEmail;
      if (targetUserId === userEmail || req.params.userId === userEmail) {
        return next(); // Allow
      }
    }

    // Special handling for profile reads - users can read their own
    if (action === 'read' && subject === 'Profile') {
      const targetUserId = req.params.userId || userEmail;
      if (targetUserId === userEmail || req.params.userId === userEmail) {
        return next(); // Allow
      }
    }

    // For other actions, check admin or allowed roles
    if (action === 'delete' && subject === 'User') {
      // Only admin can delete
      if (userRole !== 'admin') {
        return res.status(403).json({
          message: `Access denied. You don't have permission to ${action} ${subject}`,
        });
      }
    }

    // Default: allow if not explicitly denied above
    next();
  }
};

// Role-based middleware for specific roles - allows multiple role checks
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

const adminOnly = (req, res, next) => {
  return roleMiddleware('admin')(req, res, next);
};

module.exports = {
  defineRules,
  checkAbility,
  roleMiddleware,
  adminOnly,
};
