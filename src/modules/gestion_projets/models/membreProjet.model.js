const { v4: uuidv4 } = require('uuid');

class MembreProjetModel {
    constructor(donnees){
        //this._valider(donnees);
        this.id = uuidv4();
        this.nom = donnees.nom.trim();
        this.roleMembre = donnees.roleMembre.trim();
        this.addedAt = new Date().toISOString();
    }
    //convertie un objet pour envoyer à firestore
    toFirestore(){
        return {id:this.id, nom: this.nom, roleMembre: this.roleMembre, addedAt: this.addedAt}
    }
    //reconstruit un objet reçu de firestore(lecture)
    static fromFirestore(data){
        const mem = Object.create(MembreProjetModel.prototype);
        return Object.assign(mem, data);
    }
}

module.exports = MembreProjetModel;