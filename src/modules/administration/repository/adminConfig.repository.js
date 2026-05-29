// On récupère uniquement l'instance Firestore déja initialisée dans ton fichier database
const { db } = require('../../../config/database'); 

class AdminConfigRepository {
  constructor() {
    // On cible le document unique d'ID 'config' dans la collection 'platformConfig'
    this.configDocRef = db.collection('platformConfig').doc('config');
  }

  /**
   * Récupère les données brutes du document de configuration
   * @returns {Promise<Object|null>} Retourne l'objet Firestore ou null si le document n'existe pas encore
   */
  async fetchRawConfig() {
    // Lecture asynchrone du document dans Firestore
    const doc = await this.configDocRef.get();
    
    // Si le document n'existe pas (première installation), on retourne null en toute sécurité
    if (!doc.exists) {
      return null;
    }
    
    // On retourne uniquement l'objet plat contenant les données
    return doc.data();
  }

  // À rajouter dans ton fichier repositories/adminConfig.repository.js existant

/**
 * Écrit ou fusionne les nouvelles données de configuration dans Firestore
 * @param {Object} cleanData - Données déjà structurées par le modèle
 */
   async updateConfig(cleanData) {
     // merge: true permet de mettre à jour partiellement sans écraser les sous-objets manquants
     await this.configDocRef.set(cleanData, { merge: true });
     return cleanData;
   }
}

// Export d'une instance unique du Repository (Singleton)
module.exports = new AdminConfigRepository();