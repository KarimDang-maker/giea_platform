const { v4: uuidv4 } = require('uuid');

// Ces constantes servent de "référentiel" pour valider les choix plus tard dans le Service.
const FINANCEMENT = ["subvention", "investissement", "mixte"]
const NIVEAU_MATURITE = ["idée","prototype","productif"]
const STATUTS = ["soumis", "en evaluation", "en revision", "bancable", "rejete", "archivé"]

class ProjetModel {
    constructor(data={}){
        // Utilisation de points-virgules pour terminer chaque instruction
        this.id = data.id || uuidv4();
        
        // porteurId stocke l'ID unique de l'utilisateur (UID de Firebase Auth)
        this.porteurId = data.porteurId || ''; 
        this.nomPorteur = data.nomPorteur || ''; 
        this.titre = data.titre || '';
        this.description = data.description || '';
        this.categorieId = data.categorieId || '';
        this.sousCategorieId = data.sousCategorieId || '';
        this.montantRecherche = data.montantRecherche || 0;
        
        // Références aux constantes déclarées en haut du fichier
        this.financement = data.financement || '';
        this.niveauMaturite = data.niveauMaturite || '';
        this.statut = data.statut || 'soumis';
        
        // Ces champs sont des tableaux car ils contiennent plusieurs objets liés au projet
        // 'suggestions' stocke l'historique des commentaires de l'Admin
        this.equipe = data.equipe || []; 
        this.documents = data.documents || []; 
        this.suggestions = data.suggestions || [];
        
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    /**
     * Logique de transition : définit quel statut peut passer à quel autre.
     * C'est la "loi" du cycle de vie du projet.c'est une sécurité pour éviter su'un futé modifie le statut depuis le frontend
     */
    static canTransitionTo(currentStatus, nextStatus) {
        const transitions = {
            'soumis': ['en evaluation', 'rejete'],
            'en evaluation': ['en revision', 'rejete', 'bancable'],
            'en revision': ['bancable', 'rejete'],
            'bancable': ['archivé'],
            'rejete': ['archivé']
        };
        return (transitions[currentStatus] || []).includes(nextStatus);
    }

    /**
     * Sérialisation : transforme l'instance en objet plat pour Firestore.
     */
    toFirestore(){
        return {...this};
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