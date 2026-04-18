const projetService = require('../services/projet.service');

class ProjetController {
    async creerProjet(req, res) {
        try {
            // On suppose que l'ID et le nom de l'utilisateur viennent d'un middleware d'auth
            const { uid, displayName } = req.user; 
            const projet = await projetService.creerUnProjet(req.body, uid, displayName);
            res.status(201).json(projet);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async obtenirProjet(req, res) {
        try {
            const projet = await projetService.obtenirProjet(req.params.id);
            res.json(projet);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async listerMesProjets(req, res) {
        try {
            const projets = await projetService.listerProjetsPorteur(req.user.uid);
            res.json(projets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async listerTousLesProjets(req, res) {
        try {
            const projets = await projetService.listerTousLesProjets();
            res.json(projets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async changerStatut(req, res) {
        try {
            const { statut, suggestion } = req.body;
            const resultat = await projetService.changerStatutProjet(req.params.id, statut, suggestion);
            res.json(resultat);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async ajouterDocument(req, res) {
        try {
            if (!req.file) throw new Error("Aucun fichier n'a été téléchargé");
            
            const document = await projetService.ajouterDocumentAuProjet(
                req.params.id, 
                req.file, 
                req.body // contient le type, nomDoc, etc.
            );
            res.status(201).json(document);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async supprimerDocument(req, res) {
        try {
            await projetService.supprimerDocumentDuProjet(req.params.id, req.params.docId);
            res.json({ message: "Document supprimé avec succès" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async ajouterMembre(req, res) {
        try {
            const membre = await projetService.ajouterMembreAuProjet(req.params.id, req.body);
            res.status(201).json(membre);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async retirerMembre(req, res) {
        try {
            await projetService.retirerMembreDuProjet(req.params.id, req.params.membreId);
            res.json({ message: "Membre retiré avec succès" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async mettreAJourInfos(req, res) {
        try {
            await projetService.mettreAJourInfosProjet(req.params.id, req.body);
            res.json({ message: "Informations mises à jour" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async supprimerProjet(req, res) {
        try {
            await projetService.supprimerProjetComplet(req.params.id);
            res.json({ message: "Projet et fichiers associés supprimés définitivement" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new ProjetController();