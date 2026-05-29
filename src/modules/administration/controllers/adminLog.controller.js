const adminLogService = require('../services/adminLog.service');

/**
 * Récupère l'historique des actions des administrateurs
 * Route associée : GET /api/admin/logs/admins
 */
exports.getAdminLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const action = req.query.action || null;

    const { logs, total } = await adminLogService.getAdminLogs({ page, limit, action });

    return res.status(200).json({
      success: true,
      message: "Journaux d'activité des administrateurs récupérés avec succès",
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Erreur Admin getAdminLogs :", error);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la récupération des logs admins : ${error.message}`
    });
  }
};

/**
 * Génère et déclenche le téléchargement du PDF des logs admins
 * Route associée : GET /api/admin/logs/admins/export
 */
exports.exportAdminLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const action = req.query.action || null;

    // 1. Demande au service le buffer binaire du PDF généré
    const pdfBuffer = await adminLogService.exportAdminLogsToPDF({ page, limit, action });

    // 2. Définition des en-têtes HTTP pour le téléchargement de fichier
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=logs_admins_${Date.now()}.pdf`);

    // 3. Envoi du flux binaire directement dans la réponse
    return res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error("Erreur Admin exportAdminLogs :", error);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de l'exportation du PDF : ${error.message}`
    });
  }
};