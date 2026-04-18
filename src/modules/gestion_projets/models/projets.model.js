const { MembreProjetModel } = require('./membreProjet.model');
const { DocumentProjetModel } = require('./documentProjet.model');

// Ces constantes servent de "référentiel" pour valider les choix plus tard dans le Service.
const FINANCEMENT = ["subvention", "investissement", "mixte"]
const NIVEAU_MATURITE = ["idée","prototype","productif"]
const STATUTS = ["soumis", "en_evaluation", "en_revision", "bancable", "rejete", "archivé"]

class ProjetModel {
    constructor(data={}){
        // Utilisation de points-virgules pour terminer chaque instruction
        this.id = data.id || null;
        
        // porteurId stocke l'ID unique de l'utilisateur (UID de Firebase Auth)
        this.porteurId = data.porteurId || ''; 
        this.nomPorteur = data.nomPorteur || ''; 
        this.titre = data.titre || '';
        this.description = data.description || '';
        this.secteur = data.secteur || '';
        this.montantRecherche = data.montantRecherche ? Number(data.montantRecherche) : 0;
        
        // Références aux constantes déclarées en haut du fichier
        this.financement = FINANCEMENT.includes(data.financement) ? data.financement : 'investissement';
        this.niveauMaturite = NIVEAU_MATURITE.includes(data.niveauMaturite) ? data.niveauMaturite : 'idée';
        this.statut = STATUTS.includes(data.statut) ? data.statut : 'soumis';
        
        // Ces champs sont des tableaux car ils contiennent plusieurs objets liés au projet
        // 'suggestions' stocke l'historique des commentaires de l'Admin
        this.equipe = (data.equipe || []).map(m => new MembreProjetModel(m)); 
        this.documents = (data.documents || []).map(d => new DocumentProjetModel(d)); 
        this.suggestions = data.suggestions || [];
        
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    static valide(data){
        if(!data.titre || data.titre.trim().length < 5) return "Le titre du projet est requis et doit comporter au moins 5 caractères";
        if(!data.description || data.description.trim().length < 20) return "La description du projet est requise et doit comporter au moins 20 caractères";
        if(!data.secteur) return "Le secteur d'activité du projet est requis";
        if(data.montantRecherche == null || isNaN(data.montantRecherche) || data.montantRecherche < 0) return "Le montant recherché doit être un nombre positif";
        if(!data.financement || !FINANCEMENT.includes(data.financement)) return "Le type de financement est invalide";
        if(!data.niveauMaturite || !NIVEAU_MATURITE.includes(data.niveauMaturite)) return "Le niveau de maturité est invalide";
        return null
    }

    /**
     * Logique de transition : définit quel statut peut passer à quel autre.
     * C'est la "loi" du cycle de vie du projet.c'est une sécurité pour éviter su'un futé modifie le statut depuis le frontend
     */
    static transition(currentStatus, nextStatus) {
        const transitions = {
            'soumis': ['en_evaluation', 'rejete'],
            'en_evaluation': ['en_revision', 'rejete', 'bancable'],
            'en_revision': ['bancable', 'rejete'],
            'bancable': ['archivé'],
            'rejete': ['archivé']
        };
        return (transitions[currentStatus] || []).includes(nextStatus);
    }

    /**
     * Sérialisation : transforme l'instance en objet plat pour Firestore.
     */
    toFirestore(){
        return {
            ...this,
            // On s'assure que les sous-objets sont aussi convertis en objets plats
            equipe: this.equipe.map(m => m.toFirestore()),
            documents: this.documents.map(d => d.toFirestore())
        };
    }

    /**
     * Assure que si l'objet est envoyé en réponse API, il est propre.
     */
    toJSON(){
        return this.toFirestore();
    }

    /**
     * Désérialisation : transforme les données de la base en une instance
     * de la classe Projets pour pouvoir utiliser canTransitionTo() ou d'autres méthodes.
     */
    static fromFirestore(data){
        if (!data) return null;
        return new ProjetModel(data);
    }
}

module.exports = { ProjetModel, FINANCEMENT, NIVEAU_MATURITE, STATUTS }