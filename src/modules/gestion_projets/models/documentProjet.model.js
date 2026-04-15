const { v4: uuidv4 } = require('uuid');

// Référentiel des types de documents autorisés
const TYPES_AUTORISES = ["business plan", "etude de marche", "autre"];

class DocumentProjetModel {
    constructor(data={}){
        this.id = data.id || uuidv4();
        this.projetId = data.projetId || '';
        this.nomDoc = data.nomDoc || '';
        this.url = data.url || '';
        this.pathStorage =  data.pathStorage || '';
        this.type = data.type || '';
        this.taille  = data.taille || '';
        this.uploadedAt = data.uploadedAt || new Date().toISOString();
    }

    /**
     * Transforme l'objet de classe (avec ses méthodes) en un objet JS simple.
     * Firestore ne comprend pas les classes, il ne veut que des données brutes.
     */
    toFirestore(){
        return { ...this };
    }

    /**
     * Utilisé automatiquement par JSON.stringify (ex: lors d'un res.send en Express).
     */
    toJSON(){
        return this.toFirestore();
    }

    /**
     * Méthode STATIC : C'est une "usine" (Factory).
     * Elle appartient à la classe DocumentProjet elle-même.
     * Usage : DocumentProjet.fromFirestore(donnees)
     * Pourquoi static ? Parce qu'on veut créer un objet à partir de rien.
     */
    static fromFirestore(data){
        if (!data) return null;
        return new DocumentProjetModel(data);
    }
}

module.exports = { DocumentProjetModel, TYPES_AUTORISES }