const adminLogRepository = require('../repository/adminLog.repository');
const { generateAdminLogsPDF } = require('../utils/pdfGenerator.util');
const { LogModel } = require('../models/configPlatform.model');

class AdminLogService {
  /**
   * Récupère et structure les journaux d'activité des administrateurs
   */
  async getAdminLogs({ page, limit, action } = {}) {
    const { logs: rawLogs, total } = await adminLogRepository.getAllLogs({ page, limit, action });

    // On transforme le tableau de données brutes en un tableau d'instances LogModel typées 'admin'
    const logs = rawLogs.map(logData => new LogModel(logData, 'admin'));
    return { logs, total };
  }

  /**
   * Récupère les logs et génère le fichier PDF brut
   * @returns {Promise<Buffer>} Buffer du fichier PDF prêt pour le téléchargement
   */
  async exportAdminLogsToPDF({ page, limit, action } = {}) {
    // 1. Récupération des logs filtrés et paginés depuis le Repository
    const { logs: rawLogs } = await adminLogRepository.getAllLogs({ page, limit, action });

    // 2. Modélisation en instances 'admin'
    const modelLogs = rawLogs.map(logData => new LogModel(logData, 'admin'));

    // 3. Transformation des objets en document PDF via l'utilitaire
    return await generateAdminLogsPDF(modelLogs);
  }
}

module.exports = new AdminLogService();