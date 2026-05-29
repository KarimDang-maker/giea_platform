/**
 * Modèle de données pour les membres GIEA.
 * Représente un membre officiel de la liste GIEA importée depuis Excel.
 */
class GieaMemberModel {
  constructor(data = {}) {
    this.email = data.email || '';
    this.addedAt = data.addedAt || new Date();
    this.addedBy = data.addedBy || ''; // Email de l'admin qui a ajouté ce membre
    this.source = data.source || 'excel'; // 'excel' ou 'manual'
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  /**
   * Validation des données du membre GIEA.
   */
  static validate(data) {
    if (!data.email || typeof data.email !== 'string') {
      return "L'email du membre est requis";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      return "Format d'email invalide";
    }

    return null; // Pas d'erreur
  }

  /**
   * Crée une instance à partir des données brutes.
   */
  static create(data) {
    const error = GieaMemberModel.validate(data);
    if (error) {
      throw new Error(error);
    }

    return new GieaMemberModel(data);
  }

  /**
   * Sérialise pour Firestore.
   */
  toFirestore() {
    return {
      email: this.email.toLowerCase().trim(),
      addedAt: this.addedAt,
      addedBy: this.addedBy,
      source: this.source,
      isActive: this.isActive,
    };
  }

  /**
   * Représentation JSON pour les réponses API.
   */
  toJSON() {
    return {
      email: this.email,
      addedAt: this.addedAt,
      addedBy: this.addedBy,
      source: this.source,
      isActive: this.isActive,
    };
  }
}

module.exports = { GieaMemberModel };
