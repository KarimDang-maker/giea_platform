const admin = require('firebase-admin');
const User = require('../../authentication/models/user.model');

const USERS_COLLECTION = 'users';

/**
 * Repository d'administration dédié à la collection des utilisateurs.
 * Ce repository gère uniquement l'accès aux données Firestore.
 */
class AdminUserRepository {
  constructor() {
    this.db = admin.firestore();
    this.collection = this.db.collection(USERS_COLLECTION);
  }

  /**
   * Récupère les utilisateurs en appliquant des filtres côté admin.
   * Le repository ne fait que construire et exécuter la requête Firestore.
   *
   * @param {Object} filters
   * @param {string} filters.status - statut du compte (ex : 'approuvé', 'suspendu', 'en_attente')
   * @param {string} filters.role - rôle à rechercher dans le tableau 'role'
   * @param {string|Date|Object} filters.date - date exacte ou intervalle de création
   */
  async getAllUsers(filters = {}) {
    try {
      let queryRef = this.collection;

      console.log('[DEBUG] Filters reçus:', filters);

      // Filtre par statut de compte
      if (filters.statusAccount) {
        queryRef = queryRef.where('statusAccount', '==', filters.statusAccount);
        console.log('[DEBUG] Filtre status appliqué:', filters.statusAccount);
      }

      // Filtre par rôle dans le tableau des rôles de l'utilisateur
      // IMPORTANT: array-contains ne fonctionne que si le champ 'role' dans Firestore est un tableau
      // Si les utilisateurs existants ont role comme string (ex: "entrepreneur"), ce filtre ne retournera rien
      // Solution: soit migrer les données vers des tableaux (ex: ["entrepreneur"]), soit utiliser '==' au lieu de 'array-contains'
      if (filters.role) {
        queryRef = queryRef.where('role', '==', filters.role);
        console.log('[DEBUG] Filtre role appliqué:', filters.role);
      }

      // Filtre par date de création
      if (filters.date) {
        const { from, to } = this._buildDateRange(filters.date);

        if (from) {
          queryRef = queryRef.where('createdAt', '>=', from);
        }

        if (to) {
          queryRef = queryRef.where('createdAt', '<=', to);
        }
      }

      const snapshot = await queryRef.limit(20).get();
      console.log('[DEBUG] Nombre de documents trouvés:', snapshot.size);

      const users = [];

      // Pour chaque document, on construit un modèle User puis on renvoie son profil public
      snapshot.forEach((doc) => {
        const userData = doc.data();
        console.log('[DEBUG] Utilisateur trouvé - email:', userData.email, 'role:', userData.role);
        const user = new User(userData);
        users.push(user.getPublicProfile());
      });

      return users;
    } catch (error) {
      console.error('[DEBUG] Erreur dans getAllUsers:', error);
      throw new Error(`Erreur lors de la récupération des utilisateurs : ${error.message}`);
    }
  }

  /**
   * Construit un intervalle de dates à partir d'un filtre de date.
   * Accepte : chaîne, Date, ou { from, to } / { exact }.
   */
  _buildDateRange(dateFilter) {
    let from = null;
    let to = null;

    if (typeof dateFilter === 'string' || dateFilter instanceof Date) {
      const exact = new Date(dateFilter);
      exact.setHours(0, 0, 0, 0);
      from = exact;
      to = new Date(exact);
      to.setHours(23, 59, 59, 999);
    } else if (typeof dateFilter === 'object' && dateFilter !== null) {
      if (dateFilter.exact) {
        const exact = new Date(dateFilter.exact);
        exact.setHours(0, 0, 0, 0);
        from = exact;
        to = new Date(exact);
        to.setHours(23, 59, 59, 999);
      } else {
        if (dateFilter.from) {
          from = new Date(dateFilter.from);
        }
        if (dateFilter.to) {
          to = new Date(dateFilter.to);
        }
      }
    }

    return { from, to };
  }

  /**
   * Approuve ou rejette un utilisateur spécifique.
   */
  async approveUser(userId, action, adminEmail, message = '') {
    if (!userId) {
      throw new Error('ID utilisateur requis');
    }

    const userDoc = await this.collection.doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('Utilisateur non trouvé');
    }

    const currentData = userDoc.data();
    if(currentData.statusAccount !== 'en_attente'){
       throw new Error(`Action impossible : le compte est déjà "${currentData.statusAccount}"`);
    }
    const statusAccount = action === 'approuver' ? 'approuvé' : 'rejeté';
    const statusReason = message || (action === 'approuver'
      ? 'Compte approuvé par l\'administrateur'
      : 'Compte rejeté par l\'administrateur');

    const updateData = {
      statusAccount,
      validatedBy: adminEmail,
      validatedAt: new Date(),
      statusReason,
      updatedAt: new Date(),
    };

    await this.collection.doc(userId).update(updateData);

    // Retourner les données mises à jour
    const updatedUser = new User({ ...currentData, ...updateData });
    return {
      userId,
      statusAccount,
      validatedBy: adminEmail,
      validatedAt: updateData.validatedAt,
      statusReason,
    };
  }

  // ✅ Repository — méthode dédiée avec bonne vérification de statut
async activateUser(userId, adminEmail, message = '') {
  if (!userId) throw new Error('ID utilisateur requis');

  const userDoc = await this.collection.doc(userId).get();
  if (!userDoc.exists) throw new Error('Utilisateur non trouvé');

  const currentData = userDoc.data();

  // ✅ Seul un compte suspendu peut être réactivé
  if (currentData.statusAccount !== 'suspendu') {
    throw new Error(
      `Action impossible : le compte est "${currentData.statusAccount}", seul un compte suspendu peut être réactivé`
    );
  }

  const updateData = {
    statusAccount: 'approuvé',
    reactivatedBy: adminEmail,
    reactivatedAt: new Date(),
    statusReason: message || "Compte réactivé par l'administrateur",
    updatedAt: new Date(),
  };

  await this.collection.doc(userId).update(updateData);

  return {
    userId,
    statusAccount: 'approuvé',
    reactivatedBy: adminEmail,
    reactivatedAt: updateData.reactivatedAt,
    statusReason: updateData.statusReason,
  };
}

  // Repository — nouvelle méthode séparée
async suspendUser(userId, adminEmail, reason = '') {
  if (!userId) throw new Error('ID utilisateur requis');

  const userDoc = await this.collection.doc(userId).get();
  if (!userDoc.exists) throw new Error('Utilisateur non trouvé');

  const currentData = userDoc.data();

  // ✅ Un compte suspendu doit être 'approuvé' au préalable
  if (currentData.statusAccount !== 'approuvé') {
    throw new Error(`Action impossible : le compte est "${currentData.statusAccount}", seul un compte approuvé peut être suspendu`);
  }

  const updateData = {
    statusAccount: 'suspendu',
    suspendedBy: adminEmail,
    suspendedAt: new Date(),
    statusReason: reason || "Compte suspendu par l'administrateur",
    updatedAt: new Date(),
  };

  await this.collection.doc(userId).update(updateData);

  return {
    userId,
    statusAccount: 'suspendu',
    suspendedBy: adminEmail,
    suspendedAt: updateData.suspendedAt,
    statusReason: updateData.statusReason,
  };
}

  /**
   * Récupère un utilisateur par son ID.
   */
  async getUserById(userId) {
    if (!userId) {
      throw new Error('ID utilisateur requis');
    }

    const userDoc = await this.collection.doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('Utilisateur non trouvé');
    }

    const user = new User(userDoc.data());
    return user.getPublicProfile();
  }

  /**
   * Supprime définitivement un utilisateur par son ID.
   */
  async deleteUser(userId) {
    if (!userId) {
      throw new Error('ID utilisateur requis');
    }

    const userDoc = await this.collection.doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('Utilisateur non trouvé');
    }

    await this.collection.doc(userId).delete();
    return true;
  }

  async updateUserRole(userId, role) {
    if (!userId) {
      throw new Error('ID utilisateur requis');
    }

    if (!role) {
      throw new Error('Rôle requis');
    }

    const userDoc = await this.collection.doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('Utilisateur non trouvé');
    }

    await this.collection.doc(userId).update({
      role,
      updatedAt: new Date(),
    });

    return { userId, role };
  }
}

module.exports = new AdminUserRepository();
