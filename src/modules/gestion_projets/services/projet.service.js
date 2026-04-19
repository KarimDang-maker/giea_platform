const projetRepository = require('../repositories/projet.repository');
const { ProjetModel } = require('../models/projets.model');
const { DocumentProjetModel } = require('../models/documentProjet.model');
const { MembreProjetModel } = require('../models/membreProjet.model');
const storageService = require('./storage.service');

class ProjetService {
    /**
     * Logique pour la création d'un projet
     */
    async creerUnProjet(data, porteurId, nomPorteur) {
        // Validation des données d'entrée via le modèle
        const erreur = ProjetModel.valide(data);
        if (erreur) throw new Error(erreur);

        // 1. On prépare l'objet via le modèle (génère l'ID, structure les données)
        const nouveauProjet = new ProjetModel({
            ...data,
            porteurId,
            nomPorteur
        });

        // 2. On pourrait ajouter des validations métier ici 
        // (ex: vérifier si l'utilisateur n'a pas déjà trop de projets en cours)

        // 3. On demande au repository d'enregistrer
        return await projetRepository.create(nouveauProjet);
    }

    /**
     * Récupérer les détails d'un projet
     */
    async obtenirProjet(id) {
        const projet = await projetRepository.findById(id);
        if (!projet) {
            throw new Error("Projet non trouvé");
        }
        return projet;
    }

    /**
     * Lister tous les projets (Action Admin)
     */
    async listerTousLesProjets() {
        return await projetRepository.findAll();
    }

    /**
     * Logique de changement de statut (Action Admin)
     */
    async changerStatutProjet(projetId, nouveauStatut, suggestionAdmin = null) {
        // 1. Récupérer le projet actuel
        const projet = await this.obtenirProjet(projetId);

        // 2. Vérifier si la transition est autorisée via la règle statique du modèle
        const estValide = ProjetModel.transition(projet.statut, nouveauStatut);
        
        if (!estValide) {
            throw new Error(`Transition de ${projet.statut} vers ${nouveauStatut} non autorisée.`);
        }

        // 3. Préparer les mises à jour
        const updates = { statut: nouveauStatut };
        
        // Si l'admin a laissé une suggestion (commentaire), on l'ajoute à l'historique
        if (suggestionAdmin) {
            const nouvellesSuggestions = [...projet.suggestions, {
                id: Date.now().toString(), // Simple ID pour le tracking
                commentaire: suggestionAdmin,
                date: new Date().toISOString(),
                statutCible: nouveauStatut,
                lu: false
            }];
            updates.suggestions = nouvellesSuggestions;
        }

        // 4. Sauvegarder
        await projetRepository.update(projetId, updates);

        // 5. TODO: Déclencher la notification ici pour le porteurId
        // C'est ici que la logique de NotificationModel interviendra
        
        return { message: "Statut mis à jour avec succès", nouveauStatut };
    }

    /**
     * Marquer toutes les suggestions comme lues (Action Porteur)
     */
    async marquerSuggestionsCommeLues(projetId) {
        const projet = await this.obtenirProjet(projetId);
        const suggestionsMisesAJour = projet.suggestions.map(s => ({ ...s, lu: true }));
        
        return await projetRepository.update(projetId, { suggestions: suggestionsMisesAJour });
    }

    /**
     * Lister les projets d'un utilisateur
     */
    async listerProjetsPorteur(porteurId) {
        return await projetRepository.findByPorteur(porteurId);
    }

    /**
     * Ajoute un document à un projet (Upload Storage + Update Firestore)
     * @param {string} projetId 
     * @param {Object} file - Fichier Multer
     * @param {Object} metadata - Données du document (type, nomDoc...)
     */
    async ajouterDocumentAuProjet(projetId, file, metadata) {
        // 1. On pré-remplit le nom si absent pour passer la validation
        const donneesDoc = { ...metadata, nomDoc: metadata.nomDoc || file.originalname };
        
        const erreur = DocumentProjetModel.valide({ ...donneesDoc, url: 'temp_url' });
        if (erreur) throw new Error(erreur);

        const projet = await this.obtenirProjet(projetId);
        
        // 2. Définir le chemin de stockage
        const destination = `projets/${projetId}/documents/${Date.now()}_${file.originalname}`;

        // 3. Upload physique vers Firebase Storage
        const { url, pathStorage } = await storageService.uploadFile(file, destination);

        // 4. Création de l'instance du modèle Document
        const nouveauDoc = new DocumentProjetModel({
            ...donneesDoc,
            url,
            pathStorage,
            taille: file.size
        });

        // 5. Ajout atomique
        await projetRepository.addItem(projetId, 'documents', nouveauDoc.toFirestore());

        return nouveauDoc;
    }

    /**
     * Supprime un document spécifique d'un projet
     */
    async supprimerDocumentDuProjet(projetId, documentId) {
        const projet = await this.obtenirProjet(projetId);
        const doc = projet.documents.find(d => d.id === documentId);
        
        if (!doc) throw new Error("Document non trouvé");

        // 1. Suppression physique
        await storageService.deleteFile(doc.pathStorage);

        // 2. Suppression logique dans le tableau (nécessite l'objet exact pour arrayRemove)
        return await projetRepository.removeItem(projetId, 'documents', doc.toFirestore());
    }

    /**
     * Gestion de l'équipe
     */
    async ajouterMembreAuProjet(projetId, membreData) {
        const erreur = MembreProjetModel.valide(membreData);
        if (erreur) throw new Error(erreur);

        const nouveauMembre = new MembreProjetModel(membreData);
        await projetRepository.addItem(projetId, 'equipe', nouveauMembre.toFirestore());
        
        return nouveauMembre;
    }

    async retirerMembreDuProjet(projetId, membreId) {
        const projet = await this.obtenirProjet(projetId);
        const membre = projet.equipe.find(m => m.id === membreId);
        
        if (!membre) throw new Error("Membre non trouvé");

        return await projetRepository.removeItem(projetId, 'equipe', membre.toFirestore());
    }

    /**
     * Mise à jour des informations de base
     */
    async mettreAJourInfosProjet(projetId, data) {
        // On ne permet pas de modifier le statut ou les tableaux via cette méthode simple
        const { statut, equipe, documents, suggestions, ...infosUpdate } = data;
        
        return await projetRepository.update(projetId, infosUpdate);
    }

    /**
     * Suppression complète d'un projet et de ses fichiers associés
     */
    async supprimerProjetComplet(projetId) {
        const projet = await this.obtenirProjet(projetId);

        // 1. Supprimer tous les fichiers physiques dans le Storage
        const deleteFilesTasks = projet.documents
            .filter(doc => doc.pathStorage)
            .map(doc => storageService.deleteFile(doc.pathStorage));
        
        await Promise.all(deleteFilesTasks);

        // 2. Supprimer le document Firestore
        return await projetRepository.delete(projetId);
    }
}

module.exports = new ProjetService();
