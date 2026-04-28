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

        // Dénormalisation du secteur : on stocke l'ID et le Nom.
        // Si data.secteur est une string, on considère que l'ID est null (nouveau secteur à créer).
        if (data.secteur && typeof data.secteur === 'object') {
            this.secteur = {
                id: data.secteur.id || null,
                name: data.secteur.name || ''
            };
        } else {
            this.secteur = {
                id: null,
                name: data.secteur || ''
            };
        }

        this.sousSecteur = data.sousSecteur || null;
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
        
        this.createdAt = this._formatDate(data.createdAt);
        this.updatedAt = this._formatDate(data.updatedAt);
    }

    static valide(data){
        if(!data.nomPorteur || data.nomPorteur.trim().length < 2) return "Le nom du porteur de projet est requis";
        if(!data.titre || data.titre.trim().length < 5) return "Le titre du projet est requis et doit comporter au moins 5 caractères";
        if(!data.description || data.description.trim().length < 20) return "La description du projet est requise et doit comporter au moins 20 caractères";
        
        // Validation du secteur : Accepte une string non vide OU un objet contenant un nom
        const s = data.secteur;
        const secteurPresent = s && (
            (typeof s === 'string' && s.trim().length > 0) || 
            (typeof s === 'object' && s.name && s.name.trim().length > 0)
        );
        if(!secteurPresent) return "Le secteur d'activité du projet est requis";

        if (data.sousSecteur && typeof data.sousSecteur !== 'string') {
            return "Le sous-secteur doit être une chaîne de caractères";
        }

        if(data.montantRecherche == null || isNaN(data.montantRecherche) || data.montantRecherche < 0) return "Le montant recherché doit être un nombre positif";
        if(!data.financement || !FINANCEMENT.includes(data.financement)) return "Le type de financement est invalide";
        if(!data.niveauMaturite || !NIVEAU_MATURITE.includes(data.niveauMaturite)) return "Le niveau de maturité est invalide";
        return null
    }

    /**
     * Helper pour transformer les Timestamps Firebase en ISOString
     */
    _formatDate(date) {
        if (!date) return new Date().toISOString();
        if (date.toDate && typeof date.toDate === 'function') return date.toDate().toISOString();
        return date;
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