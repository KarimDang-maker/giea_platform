const adminUserService = require('../services/adminUser.service');

/**
 * Contrôleur admin : liste des utilisateurs filtrés.
 * Le middleware auth + adminOnly protège cette route.
 * NOTE: Cette route est en GET (pas POST) - utilisez /api/admin/users?role=entrepreneur
 */
exports.getAllUsers = async (req, res) => {
  try {
    const filters = {
      statusAccount: req.query.statusAccount,
      role: req.query.role,
      date: req.query.date ? req.query.date : undefined,
    };

    const users = await adminUserService.getAllUsers(filters);
    res.json({ message: 'Liste des utilisateurs récupérée', data: users, filters });
  } catch (error) {
    console.error('Erreur Admin getAllUsers :', error);
    res.status(400).json({ message: `Erreur lors de la récupération des utilisateurs : ${error.message}` });
  }
};

/**
 * Contrôleur admin : créer un utilisateur et définir son rôle.
 */
exports.createUser = async (req, res) => {
  try {
    const adminEmail = req.user?.userId;
    const userData = req.body;
    const result = await adminUserService.createUser(userData, adminEmail);
    res.status(201).json({ message: result.message, data: result.data });
  } catch (error) {
    console.error('Erreur Admin createUser :', error);
    res.status(400).json({ message: `Erreur lors de la création de l'utilisateur : ${error.message}` });
  }
};

/**
 * Contrôleur admin : approuver ou refuser un compte.
 */
exports.approveUser = async (req, res) => {
  try {
    const { action, message = '' } = req.body;
    const adminEmail = req.user?.userId;
    const userId = req.params.userId;

    if (!action || !['approuver', 'rejeter'].includes(action)) {
      return res.status(400).json({ message: 'Action requise : "approuver" ou "rejeter"' });
    }

    const result = await adminUserService.approveUserById(userId, action, adminEmail, message);
    res.json({ message: result.message, data: result });
  } catch (error) {
    console.error('Erreur Admin approveUser :', error);
    res.status(400).json({ message: `Erreur lors de la validation du compte : ${error.message}` });
  }
};

/**
 * Contrôleur admin : importer les membres GIEA depuis une liste d'emails.
 */
exports.importMembers = async (req, res) => {
  try {
    const { emails } = req.body;
    const adminEmail = req.user?.userId;

    if (!Array.isArray(emails)) {
      return res.status(400).json({ message: 'Le champ emails doit être un tableau' });
    }

    const result = await adminUserService.importGieaMembers(emails, adminEmail);
    res.json({ message: 'Liste des membres GIEA mise à jour', result });
  } catch (error) {
    console.error('Erreur Admin importMembers :', error);
    res.status(400).json({ message: `Erreur lors de l'import des membres GIEA : ${error.message}` });
  }
};

/**
 * Contrôleur admin : vérifier le statut de membership GIEA d'un email.
 */
exports.importMembersFromExcel = async (req, res) => {
  try {
    const file = req.file;
    const adminEmail = req.user?.userId;

    if (!file) {
      return res.status(400).json({ message: 'Fichier Excel requis' });
    }

    const result = await adminUserService.importGieaMembersFromExcel(file.buffer, adminEmail);
    res.json({ message: 'Liste des membres GIEA importée depuis Excel', result });
  } catch (error) {
    console.error('Erreur Admin importMembersFromExcel :', error);
    res.status(400).json({ message: `Erreur lors de l'import Excel des membres GIEA : ${error.message}` });
  }
};

exports.getMembershipStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const status = await adminUserService.getMembershipStatus(userId);
    res.json({ message: 'Statut de membership GIEA récupéré', data: status });
  } catch (error) {
    console.error('Erreur Admin getMembershipStatus :', error);
    res.status(400).json({ message: `Erreur lors de la vérification du statut GIEA : ${error.message}` });
  }
};

/**
 * Contrôleur admin : voir le profil complet d'un utilisateur.
 */
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await adminUserService.getUserProfile(userId);
    res.json({ message: 'Profil utilisateur récupéré', data: user });
  } catch (error) {
    console.error('Erreur Admin getUserProfile :', error);
    res.status(400).json({ message: `Erreur lors de la récupération du profil utilisateur : ${error.message}` });
  }
};

/**
 * Contrôleur admin : changer le rôle d'un utilisateur.
 */
exports.changeUserRole = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { role } = req.body;
    const adminEmail = req.user?.userId;

    if (!role) {
      return res.status(400).json({ message: 'Role requis' });
    }

    const result = await adminUserService.changeUserRole(userId, role, adminEmail);
    res.json({ message: result.message, data: result });
  } catch (error) {
    console.error('Erreur Admin changeUserRole :', error);
    res.status(400).json({ message: `Erreur lors du changement de rôle : ${error.message}` });
  }
};

/**
 * Contrôleur admin : récupérer tous les membres GIEA actifs.
 */
exports.getAllGieaMembers = async (req, res) => {
  try {
    const members = await adminUserService.getAllGieaMembers();
    res.json({ message: 'Liste des membres GIEA récupérée', data: members });
  } catch (error) {
    console.error('Erreur Admin getAllGieaMembers :', error);
    res.status(400).json({ message: `Erreur lors de la récupération des membres GIEA : ${error.message}` });
  }
};

/**
 * Contrôleur admin : suspendre temporairement un utilisateur.
 */
exports.suspendUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { reason = '' } = req.body;
    const adminEmail = req.user?.userId;

    const result = await adminUserService.suspendUserById(userId, adminEmail, reason);
    res.json({ message: result.message, data: result });
  } catch (error) {
    console.error('Erreur Admin suspendUser :', error);
    res.status(400).json({ message: `Erreur lors de la suspension du compte : ${error.message}` });
  }
};

/**
 * Contrôleur admin : réactiver un utilisateur suspendu.
 */
// ✅ Controller simplifié — pas besoin d'action
exports.activateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { message = '' } = req.body;
    const adminEmail = req.user?.userId;

    if (!adminEmail) {
      return res.status(401).json({ message: 'Administrateur non authentifié' });
    }

    const result = await adminUserService.activateUserById(userId, adminEmail, message);
    res.json({ message: result.message, data: result });
  } catch (error) {
    console.error('Erreur Admin activateUser :', error);
    res.status(400).json({ message: `Erreur lors de la réactivation : ${error.message}` });
  }
};
/**
 * Contrôleur admin : supprimer définitivement un utilisateur.
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const adminEmail = req.user?.userId;

    const result = await adminUserService.deleteUserById(userId, adminEmail);
    res.json({ message: result.message, data: result });
  } catch (error) {
    console.error('Erreur Admin deleteUser :', error);
    res.status(400).json({ message: `Erreur lors de la suppression de l'utilisateur : ${error.message}` });
  }
};
