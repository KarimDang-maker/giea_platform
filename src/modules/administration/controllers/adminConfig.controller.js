// Importation du service de configuration
const adminConfigService = require('../services/adminConfig.service');

/**
 * Gère la récupération de la configuration globale de la plateforme
 * Route associée : GET /api/admin/config
 */
exports.getPlatformConfig = async (req, res) => {
  try {
    // 1. Demande au service de récupérer le modèle de configuration formaté
    const config = await adminConfigService.getConfig();
    
    // 2. Renvoi de la réponse de succès (Statut 200) avec la structure standard du projet
    return res.status(200).json({
      success: true,
      message: "Configuration de la plateforme récupérée avec succès",
      data: config
    });
    
  } catch (error) {
    // 3. Centralisation et traçabilité de l'erreur en console pour le débogage
    console.error("Erreur Admin getPlatformConfig :", error);
    
    // 4. Renvoi de l'erreur au client (Statut 400 ou 500 selon tes standards de gestion d'erreurs)
    return res.status(400).json({
      success: false,
      message: `Erreur lors de la récupération de la configuration : ${error.message}`
    });
  }
};

/**
 * Gère la requête de modification de la configuration
 * Route associée : PATCH /api/admin/config
 */
exports.updatePlatformConfig = async (req, res) => {
  try {
    const adminId = req.user.uid; // Injecté en amont par ton authMiddleware
    const file = req.file;        // Injecté par le middleware multer

    // Validation de sécurité manuelle sur le type binaire puisque req.path /config/ n'est pas filtré dans ton multer.js
    if (file && !file.mimetype.startsWith('image/')) {
      return res.status(400).json({ 
        message: "Format de fichier invalide. Le logo doit impérativement être une image." 
      });
    }

    // Appel du traitement de mise à jour au niveau du service
    const updatedConfig = await adminConfigService.updateConfig(req.body, file, adminId);

    return res.status(200).json({
      message: "Configuration globale mise à jour avec succès",
      data: updatedConfig
    });

  } catch (error) {
    console.error("Erreur Admin updatePlatformConfig :", error);
    return res.status(400).json({
      message: `Erreur lors de la modification de la configuration : ${error.message}`
    });
  }
};