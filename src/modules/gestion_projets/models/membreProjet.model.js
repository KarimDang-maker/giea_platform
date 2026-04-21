const { v4: uuidv4 } = require('uuid');

class MembreProjetModel {
    constructor(data={}){
        this.id = data.id || uuidv4();
        this.nom = data.nom || '';
        this.role = data.role || 'participant';
        this.addedAt = data.addedAt || new Date().toISOString();
    }


    //on s'assure que les données reçu du frontend sonty complètes
    static valide(data){
        if(!data.nom || data.nom.trim().length < 2) return "Le nom du membre est requis";
        if(!data.role) return "le role est requis";
        return null;
    }
    /**
     * Prépare les données pour l'enregistrement en base de données.
     */
    toFirestore(){
        return { ...this };
    }

    /**
     * Prépare les données pour l'envoi vers le front-end.
     */
    toJSON(){
        return this.toFirestore();
    }

    static fromFirestore(data){
        if (!data) return null;
        return new MembreProjetModel(data);
    }
}

module.exports = { MembreProjetModel };