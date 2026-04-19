const admin = require('firebase-admin');
const db = admin.firestore();
const { ProjetModel } = require('../models/projets.model');

const COLLECTION_NAME = 'projets';

class ProjetRepository {
    /**
     * Crée un nouveau projet. Si projet.id est null, Firestore génère un ID.
     */
    async create(projet) {
        try {
            const docRef = projet.id 
                ? db.collection(COLLECTION_NAME).doc(projet.id) 
                : db.collection(COLLECTION_NAME).doc();
            
            projet.id = docRef.id;
            await docRef.set(projet.toFirestore());
            return projet;
        } catch (error) {
            throw new Error(`Erreur lors de la création du projet : ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const doc = await db.collection(COLLECTION_NAME).doc(id).get();
            return doc.exists ? ProjetModel.fromFirestore({ id: doc.id, ...doc.data() }) : null;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du projet ${id} : ${error.message}`);
        }
    }

    async findByPorteur(porteurId) {
        try {
            const snapshot = await db.collection(COLLECTION_NAME)
                .where('porteurId', '==', porteurId)
                .orderBy('createdAt', 'desc')
                .get();
            return snapshot.docs.map(doc => ProjetModel.fromFirestore({ id: doc.id, ...doc.data() }));
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des projets : ${error.message}`);
        }
    }

    async findAll() {
        try {
            // Ajout d'une limite de sécurité de 100 pour éviter les surcharges
            const snapshot = await db.collection(COLLECTION_NAME)
                .orderBy('createdAt', 'desc')
                .limit(100) 
                .get();
            return snapshot.docs.map(doc => ProjetModel.fromFirestore({ id: doc.id, ...doc.data() }));
        } catch (error) {
            throw new Error(`Erreur lors de la récupération de tous les projets : ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            const docRef = db.collection(COLLECTION_NAME).doc(id);
            await docRef.update({
                ...data,
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du projet ${id} : ${error.message}`);
        }
    }

    async delete(id) {
        try {
            await db.collection(COLLECTION_NAME).doc(id).delete();
            return true;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du projet ${id} : ${error.message}`);
        }
    }

    // --- Gestion des Tableaux Embarqués ---

    /**
     * Ajoute un membre ou un document via arrayUnion (Atomique)
     */
    async addItem(id, field, item) {
        try {
            const docRef = db.collection(COLLECTION_NAME).doc(id);
            await docRef.update({
                [field]: admin.firestore.FieldValue.arrayUnion(item),
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            throw new Error(`Erreur lors de l'ajout dans le champ ${field} : ${error.message}`);
        }
    }

    /**
     * Supprime un item exact du tableau. 
     * ATTENTION: Firestore nécessite l'objet EXACT (tous les champs) pour arrayRemove.
     */
    async removeItem(id, field, item) {
        try {
            const docRef = db.collection(COLLECTION_NAME).doc(id);
            await docRef.update({
                [field]: admin.firestore.FieldValue.arrayRemove(item),
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression dans le champ ${field} : ${error.message}`);
        }
    }

    /**
     * Pour les suggestions ou modifications d'items existants, 
     * on remplace le tableau complet après modification en mémoire.
     */
    async updateArray(id, field, newArray) {
        try {
            const docRef = db.collection(COLLECTION_NAME).doc(id);
            
            // Sécurité: On s'assure que chaque élément est un objet plat (cas où on passerait des instances de classe)
            const cleanArray = newArray.map(item => item.toFirestore ? item.toFirestore() : item);

            await docRef.update({
                [field]: cleanArray,
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            throw new Error(`Erreur lors du remplacement du tableau ${field} : ${error.message}`);
        }
    }
}

module.exports = new ProjetRepository();