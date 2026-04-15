const admin = require('firebase-admin');
const { ProjetModel } = require('../models/projets.model');

const db = admin.firestore();
const COLLECTION_NAME = 'projets';

class ProjetRepository {
    /**
     * Enregistre un nouveau projet
     * @param {ProjetModel} projet - Instance du modèle Projet
     */
    async create(projet) {
        try {
            // .doc(id) permet de définir l'ID manuellement (celui de uuid)
            // .toFirestore() transforme notre classe en objet simple
            await db.collection(COLLECTION_NAME)
                .doc(projet.id)
                .set(projet.toFirestore());
            
            return projet;
        } catch (error) {
            console.error("Erreur Repository Create:", error);
            throw new Error("Impossible de créer le projet dans la base de données.");
        }
    }

    /**
     * Récupère un projet par son ID
     * @param {string} id 
     */
    async findById(id) {
        try {
            const doc = await db.collection(COLLECTION_NAME).doc(id).get();
            
            if (!doc.exists) return null;

            // On utilise fromFirestore pour transformer les données brutes
            // en une instance de notre classe ProjetModel
            return ProjetModel.fromFirestore({ id: doc.id, ...doc.data() });
        } catch (error) {
            console.error("Erreur Repository findById:", error);
            throw new Error("Erreur lors de la récupération du projet.");
        }
    }

    /**
     * Met à jour les données d'un projet
     */
    async update(id, updateData) {
        try {
            // On ajoute automatiquement la date de mise à jour
            const dataToUpdate = {
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            await db.collection(COLLECTION_NAME).doc(id).update(dataToUpdate);
            return true;
        } catch (error) {
            console.error("Erreur Repository update:", error);
            throw new Error("Erreur lors de la mise à jour du projet.");
        }
    }

    /**
     * Récupère tous les projets d'un porteur spécifique
     * @param {string} porteurId 
     */
    async findAllByPorteur(porteurId) {
        try {
            const snapshot = await db.collection(COLLECTION_NAME)
                .where('porteurId', '==', porteurId)
                .get();

            // On transforme chaque document trouvé en une instance de ProjetModel
            return snapshot.docs.map(doc => 
                ProjetModel.fromFirestore({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            console.error("Erreur Repository findAllByPorteur:", error);
            throw new Error("Erreur lors de la récupération des projets du porteur.");
        }
    }
}

module.exports = new ProjetRepository();