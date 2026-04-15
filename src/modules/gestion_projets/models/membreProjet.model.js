const { v4: uuidv4 } = require('uuid');

class MembreProjetModel {
    constructor(data={}){
        this.id = data.id || uuidv4();
        this.projetId = data.projetId || '';
        this.nom = data.nom || '';
        this.role = data.role || 'participant';
        this.biographie = data.biographie || '';
        this.addedAt = data.addedAt || new Date().toISOString();
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

module.exports = MembreProjetModel;