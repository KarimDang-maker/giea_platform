const admin = require('firebase-admin');

class StorageService {
    constructor() {
        this.bucket = admin.storage().bucket();
    }

    /**
     * Upload un fichier vers Firebase Storage
     * @param {Object} file - Objet fichier de Multer (buffer)
     * @param {string} destination - Chemin complet dans le bucket
     * @returns {Promise<{url: string, pathStorage: string}>}
     */
    async uploadFile(file, destination) {
        try {
            const fileUpload = this.bucket.file(destination);
            
            await fileUpload.save(file.buffer, {
                metadata: { contentType: file.mimetype }
            });

            // Génère une URL signée ou rend le fichier public
            // Ici on utilise une URL signée valable 10 ans pour la simplicité
            const [url] = await fileUpload.getSignedUrl({
                action: 'read',
                expires: '01-01-2035'
            });

            return { url, pathStorage: destination };
        } catch (error) {
            throw new Error(`Erreur Storage Upload : ${error.message}`);
        }
    }

    /**
     * Supprime un fichier du Storage
     * @param {string} pathStorage - Chemin du fichier dans le bucket
     */
    async deleteFile(pathStorage) {
        try {
            if (!pathStorage) return;
            const file = this.bucket.file(pathStorage);
            const [exists] = await file.exists();
            if (exists) {
                await file.delete();
            }
        } catch (error) {
            console.error(`Erreur Storage Delete (${pathStorage}) :`, error.message);
        }
    }
}

module.exports = new StorageService();