// On récupère l'instance admin déjà initialisée dans ton fichier database
const { admin } = require('../../../config/database');

/**
 * Téléverse un fichier binaire depuis la mémoire vers Firebase Storage
 * @param {Object} file - Le fichier extrait par multer (req.file)
 * @returns {Promise<string>} L'URL publique d'accès au fichier
 */
const uploadPlatformLogo = async (file) => {
  if (!file) return null;

  // Récupération du bucket par défaut configuré lors de l'initialization
  const bucket = admin.storage().bucket();
  
  // Extraction de l'extension et création d'un nom unique pour éviter les conflits de cache
  const extension = file.originalname.split('.').pop();
  const fileName = `platform/branding/logo_${Date.now()}.${extension}`;
  const fileUpload = bucket.file(fileName);

  // Sauvegarde du fichier en mémoire dans le Storage
  await fileUpload.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
    },
  });

  // Rendre le fichier lisible par tout le monde sur le web
  await fileUpload.makePublic();

  // Génération de l'URL de téléchargement publique standard de Google Cloud Storage
  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
};

module.exports = { uploadPlatformLogo };