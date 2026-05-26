class PlatformConfigModel {
    constructor(data = {}) {
        // Bloc 'general' : Identité publique, coordonnées et branding de l'application
        this.general = {
            nomPlateforme: data.general?.nomPlateforme || '',
            description: data.general?.description || '',
            logo: data.general?.logo || '', // URL pointant vers Firebase Storage
            email: data.general?.email || '',
            telephone: data.general?.telephone || '',
            adresse: data.general?.adresse || ''
        };

        // Bloc 'langues' : Configuration de l'internationalisation (
        this.langues = {
            disponibles: data.langues?.disponibles || ['fr'],
            defaut: data.langues?.defaut || 'fr'
        };

        // Bloc 'securite' : Paramètres stricts de gestion des jetons et des blocages d'accès
        this.securite = {
            dureeSession: data.securite?.dureeSession ? Number(data.securite.dureeSession) : 60, // En minutes
            tentativesConnexionMax: data.securite?.tentativesConnexionMax ? Number(data.securite.tentativesConnexionMax) : 5,
            delaiBlockageCompte: data.securite?.delaiBlockageCompte ? Number(data.securite.delaiBlockageCompte) : 15 // En minutes
        };

        // Bloc 'modules' : Interrupteurs généraux pour activer/désactiver les services de la plateforme
        this.modules = {
            marketplace: data.modules?.marketplace || false,
            formation: data.modules?.formation || false,
            evenements: data.modules?.evenements || false,
        };

        // Bloc 'legal' : Contenus textuels juridiques obligatoires
        this.legal = {
            cgu: data.legal?.cgu || '',
            mentionsLegales: data.legal?.mentionsLegales || '',
            politiqueConfidentialite: data.legal?.politiqueConfidentialite || ''
        };

        // Métadonnées d'audit (Qui a modifié la configuration en dernier ?)
        this.updatedBy = data.updatedBy || null; // Contient un UID d'administrateur
        this.updatedAt = this._formatDate(data.updatedAt, new Date().toISOString());
    }

    /**
     * Convertisseur sécurisé pour transformer les Timestamps natifs Firestore en chaînes ISO
     */
    _formatDate(date, defaultValue) {
        if (!date) return defaultValue;
        if (date.toDate && typeof date.toDate === 'function') return date.toDate().toISOString();
        return date;
    }

    /**
     * Sérialise l'ensemble des sous-objets imbriqués pour enregistrement dans le document unique 'config'
     */
    toFirestore() {
        return { ...this };
    }
}