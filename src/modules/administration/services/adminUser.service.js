const userRepository = require('../../authentication/repositories/user.repository');
const adminUserRepository = require('../repository/adminUser.repository');
const gieaMemberRepository = require('../repository/gieaMember.repository');
const { GieaMemberModel } = require('../models/gieaMember.model');
const xlsx = require('xlsx');

/**
 * Service du module administration.
 * Ce service orchestre la logique métier admin et utilise les repositories.
 */
class AdminUserService {
  /**
   * Retourne la liste des utilisateurs pour l'admin selon les filtres fournis.
   */
  async getAllUsers(filters = {}) {
    return adminUserRepository.getAllUsers(filters);
  }

  /**
   * Vérifie si un email figure dans la liste des membres GIEA.
   * Cette information est utile pour afficher un message d'indication à l'admin.
   */
  async buildMembershipStatus(email) {
    const isGieaMember = await gieaMemberRepository.isMember(email);
    return {
      isGieaMember,
      membershipMessage: isGieaMember
        ? "Membre GIEA."
        : "Pas membres GIEA.",
    };
  }

  /**
   * Crée un utilisateur via l'interface administrateur.
   * L'admin enregistre l'utilisateur avec les informations essentielles.
   * L'utilisateur est directement approuvé et peut se connecter.
   * Pas de vérification GIEA (bypass admin).
   */
  async createUser(userData = {}, adminEmail) {
    if (!adminEmail) {
      throw new Error('Email de l\'administrateur requis');
    }

    const {
      firstName,
      lastName,
      email,
      password,
      role = 'student',
    } = userData;

    if (!firstName || !lastName || !email || !password) {
      throw new Error('Prénom, nom, email et mot de passe sont requis');
    }

    const normalizedEmail = email.toLowerCase();
    const userExists = await userRepository.emailExists(normalizedEmail);
    if (userExists) {
      throw new Error('Email déjà utilisé');
    }

    // Utilisateur créé par admin : directement approuvé, pas de vérif GIEA
    const payload = {
      firstName,
      lastName,
      email: normalizedEmail,
      password,
      role,
      statusAccount: 'approuvé',
      isVerified: true,
      isActive: true,
      isGieaMember: false,
      membershipMessage: 'N/A (créé par administrateur)',
      validatedBy: adminEmail,
      validatedAt: new Date(),
      statusReason: 'Compte créé par l\'administrateur - accès immédiat',
    };

    const savedUser = await userRepository.create(payload);

    return {
      success: true,
      message: 'Utilisateur créé et approuvé par l\'administrateur - accès immédiat',
      data: savedUser.getPublicProfile(),
    };
  }

  /**
   * Importe une liste d'emails membres GIEA.
   * Le repository stocke chaque email normalisé dans Firestore.
   */
  async importGieaMembers(emails = [], adminEmail) {
    if (!adminEmail) {
      throw new Error('Email de l\'administrateur requis');
    }
    return gieaMemberRepository.saveMembers(emails, adminEmail, 'manual');
  }

  /**
   * Importe un fichier Excel contenant la liste des emails GIEA.
   * Le fichier est lu en mémoire puis transformé en tableau d'emails.
   */
  async importGieaMembersFromExcel(fileBuffer, adminEmail) {
    if (!fileBuffer) {
      throw new Error('Fichier Excel requis pour l\'import des membres GIEA');
    }

    if (!adminEmail) {
      throw new Error('Email de l\'administrateur requis');
    }

    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    const emails = rows
      .map((row) => {
        const values = Object.values(row);
        return values.length > 0 ? String(values[0]).trim().toLowerCase() : '';
      })
      .filter((value) => typeof value === 'string' && value.includes('@'));

    if (emails.length === 0) {
      throw new Error('Aucun email valide trouvé dans le fichier Excel');
    }

    return gieaMemberRepository.saveMembers(emails, adminEmail, 'excel');
  }

  /**
   * Approuve ou rejette un utilisateur spécifique par ID.
   */

  /**
   * Récupère le statut d'adhésion d'un utilisateur.
   */
  async getMembershipStatus(userId) {
    if (!userId) {
      throw new Error('ID utilisateur requis');
    }

    const user = await adminUserRepository.getUserById(userId);

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const membershipStatus = await this.buildMembershipStatus(user.email);

    return {
      userId,
      email: user.email,
      ...membershipStatus,
      status: user.statusAccount,
      role: user.role,
    };
  }

  /**
   * Récupère le profil complet d'un utilisateur pour l'admin.
   */
  async getUserProfile(userId) {
    if (!userId) {
      throw new Error('ID utilisateur requis');
    }

    return await adminUserRepository.getUserById(userId);
  }

  /**
   * Change le rôle d'un utilisateur.
   */
  async changeUserRole(userId, role, adminEmail) {
    if (!userId) {
      throw new Error('ID utilisateur requis');
    }

    if (!role) {
      throw new Error('Rôle requis');
    }

    if (!adminEmail) {
      throw new Error('Email de l\'administrateur requis');
    }

    const result = await adminUserRepository.updateUserRole(userId, role);

    return {
      success: true,
      message: `Rôle de l'utilisateur mis à jour vers '${role}'`,
      userId,
      role: result.role,
    };
  }

  /**
   * Récupère tous les membres GIEA actifs.
   */
  async getAllGieaMembers() {
    return await gieaMemberRepository.getAllActiveMembers();
  }

  /**
   * Suspends a user account until reactivation.
   */
  async suspendUserById(userId, adminEmail, reason = '') {
    if (!userId) {
      throw new Error('ID utilisateur requis');
    }

    if (!adminEmail) {
      throw new Error('Email de l\'administrateur requis');
    }

    const message = reason || 'Compte suspendu par l\'administrateur';
    const result = await adminUserRepository.suspendUser(userId, 'rejeter', adminEmail, message);

    return {
      success: true,
      message: 'Utilisateur suspendu avec succès',
      ...result,
    };
  }

  /**
   * Réactive un utilisateur suspendu.
   */
  // ✅ Service simplifié — plus de paramètre action
async activateUserById(userId, adminEmail, message = '') {
  if (!userId) throw new Error('ID utilisateur requis');
  if (!adminEmail) throw new Error('Email administrateur requis');

  const result = await adminUserRepository.activateUser(userId, adminEmail, message);

  return {
    success: true,
    message: 'Utilisateur réactivé avec succès',
    ...result,
  };
}

  /**
   * Supprime définitivement un utilisateur.
   */
  async deleteUserById(userId, adminEmail) {
    if (!userId) {
      throw new Error('ID utilisateur requis');
    }

    if (!adminEmail) {
      throw new Error('Email de l\'administrateur requis');
    }

    await adminUserRepository.deleteUser(userId);

    return {
      success: true,
      message: 'Utilisateur supprimé définitivement',
      userId,
      deletedBy: adminEmail,
    };
  }

  /**
   * Approuve ou rejette un utilisateur spécifique par ID.
   */
  async approveUserById(userId, action, adminEmail, message = '') {
    if (!userId) {
      throw new Error('ID utilisateur requis');
    }

    if (!['approuver', 'rejeter'].includes(action)) {
      throw new Error('Action invalide. Utilisez "approuver" ou "rejeter"');
    }

    const result = await adminUserRepository.approveUser(userId, action, adminEmail, message);

    return {
      success: true,
      message: action === 'approuver'
        ? 'Utilisateur approuvé avec succès'
        : 'Utilisateur rejeté avec succès',
      userId,
      action,
      ...result,
    };
  }
}

module.exports = new AdminUserService();
