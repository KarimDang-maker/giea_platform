const projetRepository = require('../repositories/projet.repository');
const { ProjetModel } = require('../models/projets.model');

class ProjetService {
    /**
     * Logique pour la création d'un projet
     */
    async creerUnProjet(data, porteurId, nomPorteur) {
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
     * Logique de changement de statut (Action Admin)
     */
    async changerStatutProjet(projetId, nouveauStatut, suggestionAdmin = null) {
        // 1. Récupérer le projet actuel
        const projet = await this.obtenirProjet(projetId);

        // 2. Vérifier si la transition est autorisée via la règle statique du modèle
        const estValide = ProjetModel.canTransitionTo(projet.statut, nouveauStatut);
        
        if (!estValide) {
            throw new Error(`Transition de ${projet.statut} vers ${nouveauStatut} non autorisée.`);
        }

        // 3. Préparer les mises à jour
        const updates = { statut: nouveauStatut };
        
        // Si l'admin a laissé une suggestion (commentaire), on l'ajoute à l'historique
        if (suggestionAdmin) {
            const nouvellesSuggestions = [...projet.suggestions, {
                commentaire: suggestionAdmin,
                date: new Date().toISOString(),
                statutCible: nouveauStatut
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
     * Lister les projets d'un utilisateur
     */
    async listerProjetsPorteur(porteurId) {
        return await projetRepository.findAllByPorteur(porteurId);
    }
}

module.exports = new ProjetService();
