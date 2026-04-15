const { v4:uuidv4 } = require('uuid');
const MembreProjetModel = require('./membreProjet.model');
const STATUTS = ['soumis', 'en évaluation', 'en révision', 'bancable', 'rejeté'];
const NIVEAU_MATURITE = ['idée','prototype','productif'];
const FINANCEMENT = ['subvention','investissement','mixte'];

//transitions possibles du projets autorisée par l'admin
const TRANSITIONS = {
    'soumis': ['en évaluation', 'rejeté'],
    'en évaluation': ['en révision', 'rejeté'],
    'en révision': ['bancable', 'en révision', 'rejeté'],
    'bancable': [],
    'rejeté': []
};

class ProjetModel {
    /**
     * @param {object} donnees - données du formulaire
     * @param {string} porteurId - UID du porteur de projet
     * @param {string} nomPorteur - nom du porteur de projet
     */
    constructor(donnees, porteurId, nomPorteur){
        this._valider(donnees, porteurId, nomPorteur);
        this.porteurId = porteurId;
        this.nomPorteur = nomPorteur.trim();
        this.id = uuidv4();
        this.titre = donnees.titre.trim();
        this.description = donnees.description.trim();
        this.secteur = donnees.secteur.trim();
        this.niveauMaturite = donnees.niveauMaturite;
        this.montantRecherche = Number(donnees.montantRecherche);
        this.typeFinancement = donnees.typeFinancement;
        this.statut = 'soumis';
        this.equipe = []; 

        if(Array.isArray(donnees.equipe)){
            this.equipe = donnees.equipe.map(m => new MembreProjetModel(m).toFirestore());
        }
        this.documents = []; //remplie via document.service.js
        this.suggestions = [];  //remplie via projet.service.js
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    //etape de validation du bon format des données
    _valider(donnee, porteurId, nomPorteur){
        if(!porteurId) throw new Error("Identifiant du porteur de projet requis");
        if(!nomPorteur?.trim()) throw new Error("Nom du porteur de projet requis");
        if(!donnee?.titre?.trim()) throw new Error("titre du projet requis");
        if(!donnee?.description?.trim()) throw new Error("description du projet requise");
        if(!donnee?.secteur?.trim()) throw new Error("secteur d'activité requis");
        if(!NIVEAU_MATURITE.includes(donnee?.niveauMaturite)) throw new Error(`Niveau invalide: ${NIVEAU_MATURITE.join(', ')}`);
        const montant = Number(donnee?.montantRecherche);
        if(isNaN(montant) || montant <= 0) throw new Error("Montant invalide");
        if(!FINANCEMENT.includes(donnee?.typeFinancement)) throw new Error(`Financement invalide: ${FINANCEMENT.join(', ')}`); 
    }

    //on vérifie si une transition de statut est auhorisé par l'admin
    static transitionAuthorise(actuel, nouveau){
        return (TRANSITIONS[actuel] || []).includes(nouveau);
    }

    //on vérifie si le porteur de projet peut modifier le projet
    static estModifiable(statut){
        return ['soumis', 'en révision'].includes(statut);
    }

    toFirestore(){
        return {
             porteurId: this.porteurId,
             nomPorteur: this.nomPorteur,
             //id: this.id,
             titre: this.titre,
             description: this.description,
             secteur: this.secteur,
             niveauMaturite: this.niveauMaturite,
             montantRecherche: this.montantRecherche,
             typeFinancement: this.typeFinancement,
             statut: this.statut,
             equipe:this.equipe,
             documents: this.documents,
             suggestions: this.suggestions,
             createdAt: this.createdAt,
             updatedAt: this.updatedAt
        }
    }

    static fromFirestore(id,data){
        const proj = Object.create(ProjetModel.prototype);
        return Object.assign(proj,data, { id })
    }
}

module.exports = { ProjetModel, STATUTS, TRANSITIONS, NIVEAU_MATURITE, FINANCEMENT };