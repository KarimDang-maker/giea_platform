const userLogService = require('../services/userLog.service');

/**
 * Récupère l'historique d'activité des utilisateurs (JSON)
 * Route associée : GET /api/admin/logs/users
 */
exports.getUserLogs = async (req, res) => {
  try {
    const logs = await userLogService.getUserLogs();
    return res.status(200).json({
      message: "Journaux d'activité des utilisateurs récupérés avec succès",
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error("Erreur Admin getUserLogs :", error);
    return res.status(400).json({
      message: `Erreur lors de la récupération des logs utilisateurs : ${error.message}`
    });
  }
};

/**
 * Exporte le journal d'activité des utilisateurs (Fichier PDF)
 * Route associée : GET /api/admin/logs/users/export
 */
exports.exportUserLogs = async (req, res) => {
  try {
    const pdfBuffer = await userLogService.exportUserLogsToPDF();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=logs_users_${Date.now()}.pdf`);
    
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Erreur Admin exportUserLogs :", error);
    return res.status(400).json({
      message: `Erreur lors de l'exportation du PDF utilisateurs : ${error.message}`
    });
  }
};