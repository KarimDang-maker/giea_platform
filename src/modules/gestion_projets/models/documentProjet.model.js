const { v4: uuidv4 } = require('uuid');
const TYPES_VALEURS = ['Business plan','Présentation','Etude du marché','Autre'];

class DocumentProjetModel {
    constructor(donnees){
        this._valider(donnees);
        this.id = uuidv4();
        this.nomDoc = donnees.nomDoc.trim();
        this.url = donnees.url;
        this.pathStorage = donnees.pathStorage;
        this.type = donnees.type;
        this.taille = donnees.taille || 0;
        this.uploadedAt = new Date().toISOString();
    }
    _valider(donnee){
        if(!donnee?.nomDoc?.trim()) throw new Error("Nom du document requis");
        if(!donnee?.url) throw new Error("url du document requise");
        if(!donnee?.pathStorage) throw new Error("Le chemin du document est requis");
        if(!TYPES_VALEURS.includes(donnee?.type)) throw new Error("le type du document est requis");
    }
    toFirestore(){
        return {
            id:this.id,
            nomDoc: this.nomDoc,
            url: this.url,
            pathStorage: this.pathStorage,
            type: this.type,
            taille: this.taille,
            uploadedAt: this.uploadedAt
        }
    }
    static fromFirestore(data){
        const doc = Object.create(DocumentProjetModel.prototype);
        return Object.assign(doc, data);
    }
}

module.exports = { DocumentProjetModel, TYPES_VALEURS }