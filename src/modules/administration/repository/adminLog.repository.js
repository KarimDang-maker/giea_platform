const { db } = require('../../../config/database');

class AdminLogRepository {
  constructor() {
    this.collection = db.collection('adminLogs');
  }

  /**
   * Récupère la liste paginée et filtrée des logs d'administration du plus récent au plus ancien
   */
  async getAllLogs({ page = 1, limit = 10, action = null } = {}) {
    let query = this.collection.orderBy('createdAt', 'desc');

    // Filtre par type d'action si fourni
    if (action) {
      query = query.where('action', '==', action);
    }

    // Pagination Firestore
    const total = (await query.count().get()).data().count;
    const offset = (page - 1) * limit;
    const snapshot = await query.offset(offset).limit(limit).get();

    if (snapshot.empty) return { logs: [], total: 0 };

    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { logs, total };
  }
}

module.exports = new AdminLogRepository();