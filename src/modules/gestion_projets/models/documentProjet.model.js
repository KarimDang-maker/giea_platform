const { v4: uuidv4 } = require('uuid');

// Référentiel des types de documents autorisés
const TYPES_AUTORISES = ["business_plan","presentation", "etude_de_marche", "autre"];

class DocumentProjetModel {
    constructor(data={}){
        this.id = data.id || uuidv4();
        this.nomDoc = data.nomDoc || '';
        this.url = data.url || '';
        this.pathStorage =  data.pathStorage || '';
        this.type = TYPES_AUTORISES.includes(data.type) ? data.type : 'autre';
        this.taille  = data.taille || 0;
        this.uploadedAt = data.uploadedAt || new Date().toISOString();
    }

    static valide(data) {
        if (!data.nomDoc) return "Le nom du document est requis";
        if (!data.url) return "L'URL du document est requise";
        if (!data.type || !TYPES_AUTORISES.includes(data.type)) return "Type de document invalide";
        return null;
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

    static fromFirestore(data){
        if (!data) return null;
        return new DocumentProjetModel(data);
    }
}

module.exports = { DocumentProjetModel, TYPES_AUTORISES }