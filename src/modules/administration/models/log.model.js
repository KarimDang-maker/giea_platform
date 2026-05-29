class LogModel {
    /**
     * Constructeur polymorphe adaptatif
     * @param {Object} data - Données du log
     * @param {string} logType - Détermine la collection cible ('admin' ou 'user')
     */
    constructor(data = {}, logType = 'user') {
        // ID du log généré automatiquement par Firestore
        this.id = data.id || null;
        
        // Branchement conditionnel des propriétés selon la nature de l'acteur (Admin ou Utilisateur basique)
        if (logType === 'admin') {
            this.adminId = data.adminId || '';
            this.adminName = data.adminName || '';
        } else {
            this.userId = data.userId || '';
            this.userNom = data.userNom || '';
        }

        // Code d'action standardisé pour faciliter les filtres (ex: 'validate_user', 'publish_projet')
        this.action = data.action || '';
        
        // Bloc 'cible' : Identifie la ressource précise ayant subi ou déclenché l'action
        this.cible = {
            type: data.cible?.type || null, // ex: 'projet', 'user', 'content'
            id: data.cible?.id || null,     // ID Firestore de l'élément cible
            nom: data.cible?.nom || null    // Titre/Nom lisible (ex: "SafeCash-237") pour affichage direct
        };

        // Conteneur de détails textuel. Si un objet est passé, il est stringifié en JSON pour éviter les crashs
        this.details = typeof data.details === 'object' ? JSON.stringify(data.details) : (data.details || '');
        
        // Horodatage précis de l'action. Crucial pour la règle d'archivage/suppression automatique après 3 mois (TTL)
        this.createdAt = this._formatDate(data.createdAt, new Date().toISOString());
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
     * Sérialise le log pour insertion directe
     */
    toFirestore() {
        return { ...this };
    }
}