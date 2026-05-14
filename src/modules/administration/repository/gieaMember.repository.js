const admin = require('firebase-admin');
const { GieaMemberModel } = require('../models/gieaMember.model');

const GIEA_MEMBERS_COLLECTION = 'giea_members';

/**
 * Repository de la liste des membres GIEA.
 * Cette collection contient uniquement des emails de membres GIEA validés par l'admin.
 */
class GieaMemberRepository {
  constructor() {
    this.db = admin.firestore();
    this.collection = this.db.collection(GIEA_MEMBERS_COLLECTION);
  }

  /**
   * Vérifie si l'email est présent dans la collection des membres GIEA.
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async isMember(email) {
    if (!email) {
      return false;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const doc = await this.collection.doc(normalizedEmail).get();
    return doc.exists && doc.data().isActive;
  }

  /**
   * Enregistre une liste d'emails dans la collection GIEA.
   * Chaque email est normalisé et ajouté en écriture batch.
   */
  async saveMembers(emails = [], adminEmail = '', source = 'excel') {
    if (!Array.isArray(emails)) {
      throw new Error('Le champ emails doit être un tableau');
    }

    const batch = this.db.batch();
    const normalizedEmails = emails
      .map((email) => (typeof email === 'string' ? email.toLowerCase().trim() : ''))
      .filter(Boolean);

    const members = [];
    normalizedEmails.forEach((email) => {
      const memberData = {
        email,
        addedAt: new Date(),
        addedBy: adminEmail,
        source,
        isActive: true,
      };

      const member = GieaMemberModel.create(memberData);
      members.push(member);

      const docRef = this.collection.doc(email);
      batch.set(docRef, member.toFirestore(), { merge: true });
    });

    if (normalizedEmails.length > 0) {
      await batch.commit();
    }

    return {
      imported: normalizedEmails.length,
      emails: normalizedEmails,
      members: members.map(m => m.toJSON()),
    };
  }

  /**
   * Récupère tous les membres GIEA actifs.
   */
  async getAllActiveMembers() {
    const snapshot = await this.collection.where('isActive', '==', true).get();
    const members = [];

    snapshot.forEach((doc) => {
      const member = new GieaMemberModel(doc.data());
      members.push(member.toJSON());
    });

    return members;
  }

  /**
   * Désactive un membre GIEA.
   */
  async deactivateMember(email) {
    if (!email) {
      throw new Error('Email requis pour désactiver un membre');
    }

    const normalizedEmail = email.toLowerCase().trim();
    await this.collection.doc(normalizedEmail).update({
      isActive: false,
      updatedAt: new Date(),
    });

    return true;
  }
}

module.exports = new GieaMemberRepository();
