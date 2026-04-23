const projetService = require('../services/projet.service');

class ProjetController {
    async creerProjet(req, res) {
        try {
            console.log("[DEBUG] Création de projet - User:", req.user);
            // Vérification de sécurité : si le middleware a été oublié, on renvoie une erreur propre
            if (!req.user) {
                console.error("[ERROR] Middleware d'authentification manquant sur la route");
                return res.status(401).json({ error: "Authentification requise pour créer un projet" });
            }

            // Adaptation au payload du TokenService : userId contient l'email
            const porteurId = req.user.userId; 
            // Le nom n'étant pas dans le token, on l'attend dans le body
            const nomPorteur = req.body.nomPorteur; 

            console.log(`[DEBUG] Tentative de création par ${porteurId} (${nomPorteur})`);
            const projet = await projetService.creerUnProjet({ ...req.body, nomPorteur }, porteurId, nomPorteur);
            console.log("[SUCCESS] Projet créé avec ID:", projet.id);
            res.status(201).json(projet);
        } catch (error) {
            console.error("[ERROR] Erreur lors de la création du projet:", error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async obtenirProjet(req, res) {
        try {
            console.log(`[DEBUG] Récupération du projet ${req.params.id}`);
            // Le projet est déjà récupéré et vérifié par le middleware estProprietaire
            res.json(req.projet);
        } catch (error) {
            console.error(`[ERROR] Erreur lors de l'obtention du projet ${req.params.id}:`, error.message);
            res.status(404).json({ error: error.message });
        }
    }

    async listerMesProjets(req, res) {
        try {
            console.log(`[DEBUG] Liste des projets pour l'utilisateur: ${req.user.userId}`);
            // On utilise userId qui correspond à l'email dans ton TokenService
            const projets = await projetService.listerProjetsPorteur(req.user.userId);
            console.log(`[SUCCESS] ${projets.length} projets trouvés`);
            res.json(projets);
        } catch (error) {
            console.error("[ERROR] Erreur lors de la liste des projets personnels:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async listerParSecteur(req, res) {
        try {
            const { secteurId } = req.params;
            console.log(`[DEBUG] Recherche de projets pour le secteur ID: ${secteurId}`);
            const projets = await projetService.listerProjetsParSecteur(secteurId);
            res.json(projets);
        } catch (error) {
            console.error(`[ERROR] Erreur lors de la recherche par secteur ${req.params.secteurId}:`, error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async listerTousLesProjets(req, res) {
        try {
            console.log("[DEBUG] Admin : Liste de tous les projets");
            const projets = await projetService.listerTousLesProjets();
            console.log(`[SUCCESS] ${projets.length} projets récupérés par l'admin`);
            res.json(projets);
        } catch (error) {
            console.error("[ERROR] Erreur admin lors de la récupération globale:", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async changerStatut(req, res) {
        try {
            console.log(`[DEBUG] Changement de statut pour projet ${req.params.id}`);
            const { statut, suggestion } = req.body;
            const resultat = await projetService.changerStatutProjet(req.params.id, statut, suggestion);
            console.log(`[SUCCESS] Nouveau statut: ${statut}`);
            res.json(resultat);
        } catch (error) {
            console.error(`[ERROR] Échec du changement de statut pour ${req.params.id}:`, error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async ajouterDocument(req, res) {
        try {
            console.log(`[DEBUG] Ajout de document pour projet ${req.params.id}`);
            if (!req.file) throw new Error("Aucun fichier n'a été téléchargé");
            
            console.log("[DEBUG] Fichier reçu:", req.file.originalname);
            const document = await projetService.ajouterDocumentAuProjet(
                req.params.id, 
                req.file, 
                req.body // contient le type, nomDoc, etc.
            );
            console.log("[SUCCESS] Document ajouté avec succès");
            res.status(201).json(document);
        } catch (error) {
            console.error(`[ERROR] Échec de l'ajout de document pour ${req.params.id}:`, error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async supprimerDocument(req, res) {
        try {
            console.log(`[DEBUG] Suppression du document ${req.params.docId} du projet ${req.params.id}`);
            await projetService.supprimerDocumentDuProjet(req.params.id, req.params.docId);
            console.log("[SUCCESS] Document supprimé physiquement et logiquement");
            res.json({ message: "Document supprimé avec succès" });
        } catch (error) {
            console.error(`[ERROR] Échec suppression document ${req.params.docId}:`, error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async ajouterMembre(req, res) {
        try {
            console.log(`[DEBUG] Ajout de membre au projet ${req.params.id}`);
            const membre = await projetService.ajouterMembreAuProjet(req.params.id, req.body);
            console.log(`[SUCCESS] Membre ${membre.nom} ajouté`);
            res.status(201).json(membre);
        } catch (error) {
            console.error(`[ERROR] Échec ajout membre pour ${req.params.id}:`, error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async retirerMembre(req, res) {
        try {
            console.log(`[DEBUG] Retrait du membre ${req.params.membreId} du projet ${req.params.id}`);
            await projetService.retirerMembreDuProjet(req.params.id, req.params.membreId);
            console.log("[SUCCESS] Membre retiré avec succès");
            res.json({ message: "Membre retiré avec succès" });
        } catch (error) {
            console.error(`[ERROR] Échec retrait membre ${req.params.membreId}:`, error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async mettreAJourInfos(req, res) {
        try {
            console.log(`[DEBUG] Mise à jour infos pour projet ${req.params.id}`);
            await projetService.mettreAJourInfosProjet(req.params.id, req.body);
            console.log("[SUCCESS] Informations mises à jour");
            res.json({ message: "Informations mises à jour" });
        } catch (error) {
            console.error(`[ERROR] Échec mise à jour infos ${req.params.id}:`, error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async supprimerProjet(req, res) {
        try {
            console.log(`[DEBUG] SUPPRESSION COMPLÈTE du projet ${req.params.id}`);
            await projetService.supprimerProjetComplet(req.params.id);
            console.log("[SUCCESS] Projet et fichiers Storage supprimés");
            res.json({ message: "Projet et fichiers associés supprimés définitivement" });
        } catch (error) {
            console.error(`[ERROR] Échec suppression complète ${req.params.id}:`, error.message);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new ProjetController();