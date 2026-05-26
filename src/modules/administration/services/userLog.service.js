const userLogRepository = require('../repositories/userLog.repository');
const { LogModel } = require('../models/platformConfig.model');
const { generateUserLogsPDF } = require('../utils/pdfGenerator.util');

class UserLogService {
  /**
   * Récupère la liste formatée des journaux d'activité utilisateurs
   */
  async getUserLogs() {
    const rawLogs = await userLogRepository.getAllLogs();
    // Passage du paramètre 'user' au modèle polymorphe
    return rawLogs.map(logData => new LogModel(logData, 'user'));
  }

  /**
   * Extrait les logs utilisateurs et compile le binaire PDF
   */
  async exportUserLogsToPDF() {
    const rawLogs = await userLogRepository.getAllLogs();
    const modelLogs = rawLogs.map(logData => new LogModel(logData, 'user'));
    
    // Appel de l'utilitaire spécifique pour l'affichage utilisateur
    const pdfBuffer = await generateUserLogsPDF(modelLogs);
    return pdfBuffer;
  }
}

module.exports = new UserLogService();