const CONTENT_TYPES = ['article', 'actualite', 'offre', 'ressource'];
const CONTENT_STATUS = ['en_attente', 'approuvé', 'rejecté'];

class ContentModel {
    constructor(data = {}) {
        this.id = data.id || null;
        this.auteurId = data.auteurId || '';
        this.auteurNom = data.auteurNom || '';
        this.type = CONTENT_TYPES.includes(data.type) ? data.type : 'article';
        this.titre = data.titre || '';
        this.corps = data.corps || '';
        this.status = CONTENT_STATUS.includes(data.status) ? data.status : 'en_attente';
        
        this.rejectionReason = data.rejectionReason || '';
        this.isPublished = data.isPublished || false;
        
        this.publishedAt = data.publishedAt || null;
        this.reviewedBy = data.reviewedBy || null;
        this.reviewedAt = this._formatDate(data.reviewedAt, null);
        this.createdAt = this._formatDate(data.createdAt, new Date().toISOString());
        this.updatedAt = this._formatDate(data.updatedAt, new Date().toISOString());
    }

    static valide(data) {
        if (!data.auteurId) return "L'ID de l'auteur est requis";
        if (!data.auteurNom) return "Le nom de l'auteur est requis";
        if (!CONTENT_TYPES.includes(data.type)) return "Le type de contenu est invalide";
        if (!data.titre || data.titre.trim().length < 5) return "Le titre est requis (min 5 caractères)";
        if (!data.corps || data.corps.trim().length < 10) return "Le corps du contenu est requis (min 10 caractères)";
        return null;
    }

    _formatDate(date, defaultValue) {
        if (!date) return defaultValue;
        if (date.toDate && typeof date.toDate === 'function') return date.toDate().toISOString();
        return date;
    }

    toFirestore() {
        return { ...this };
    }

    toJSON() {
    return { ...this };
  }
}

module.exports = { ContentModel, CONTENT_TYPES, CONTENT_STATUS };