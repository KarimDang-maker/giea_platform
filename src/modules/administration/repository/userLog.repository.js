const { db } = require('../../../config/database');

class UserLogRepository {
  constructor() {
    this.collection = db.collection('userLogs');
  }

  /**
   * Récupère tous les logs de l'activité des utilisateurs, du plus récent au plus ancien
   */
  async getAllLogs() {
    const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
    
    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}

module.exports = new UserLogRepository();