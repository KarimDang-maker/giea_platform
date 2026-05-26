// Importation du repository fraîchement créé pour l'accès aux données brutes
const adminConfigRepository = require('../repository/adminConfig.repository');
const { uploadPlatformLogo } = require('../utils/storage.util');
// Importation du modèle pour structurer et nettoyer la configuration
const { PlatformConfigModel } = require('../models/configPlatform.model');

class AdminConfigService {
  /**
   * Récupère la configuration globale purifiée par le modèle métier
   * @returns {Promise<PlatformConfigModel>} Instance du modèle de configuration
   */
  async getConfig() {
    // 1. Appel du repository pour extraire les données brutes de Firestore
    const rawData = await adminConfigRepository.fetchRawConfig();
    
    // 2. Traitement des données par le modèle
    // Si rawData est null (le document n'existe pas encore), le constructeur 
    // de PlatformConfigModel générera automatiquement une structure par défaut saine.
    if (!rawData) {
      return new PlatformConfigModel();
    }
    
    // Si les données existent, on instancie le modèle avec celles-ci pour les formater
    return new PlatformConfigModel(rawData);
  }

/**
 * Gère la logique métier de mise à jour de la configuration globale
 */
async updateConfig(rawBody, file, adminId) {
  // 1. Parsing manuel des blocs JSON car les données envoyées via FormData (obligatoire pour Multer) arrivent souvent en chaînes de caractères
  const general = typeof rawBody.general === 'string' ? JSON.parse(rawBody.general) : (rawBody.general || {});
  const langues = typeof rawBody.langues === 'string' ? JSON.parse(rawBody.langues) : rawBody.langues;
  const securite = typeof rawBody.securite === 'string' ? JSON.parse(rawBody.securite) : rawBody.securite;
  const modules = typeof rawBody.modules === 'string' ? JSON.parse(rawBody.modules) : rawBody.modules;
  const legal = typeof rawBody.legal === 'string' ? JSON.parse(rawBody.legal) : rawBody.legal;

  // 2. Récupérer la configuration existante pour conserver l'ancien logo s'il n'y a pas de nouvelle image soumise
  const currentConfig = await this.getConfig();
  let logoUrl = currentConfig.general.logo;

  // 3. Si un nouveau fichier est fourni, on appelle l'utilitaire d'upload pour écraser la variable logoUrl
  if (file) {
    logoUrl = await uploadPlatformLogo(file);
  }

  // 4. Instanciation du modèle avec fusion du logo pour validation et formatage des types (String, Number, etc.)
  const updatedConfigInstance = new PlatformConfigModel({
    general: { ...general, logo: logoUrl },
    langues,
    securite,
    modules,
    legal,
    updatedBy: adminId,
    updatedAt: new Date().toISOString()
  });

  // 5. Envoi au repository pour persistance dans Firestore
  await adminConfigRepository.updateConfig(updatedConfigInstance.toFirestore());

  return updatedConfigInstance;
}
}

// Export de l'instance unique du Service
module.exports = new AdminConfigService();