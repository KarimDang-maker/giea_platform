const multer = require('multer');

/**
 * Configuration de Multer pour stocker les fichiers en mémoire (buffer)
 * Cela permet de les envoyer directement à Firebase Storage sans écrire sur le disque local.
 */
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Limite fixée à 10 Mo par fichier
    }
});

module.exports = upload;