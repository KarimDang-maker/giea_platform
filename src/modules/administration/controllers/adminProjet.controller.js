const projetService = require('../../gestion_projets/services/projet.service');
const adminProjetService = require('../services/adminProjet.service')


exports.getUnicProjet = async (req, res) => {
  try {
    const id = req.params.id;
    const projet = await adminProjetService.getUniqueProjet(id);
    res.json({ message: 'Projet récupéré', data: projet });
  } catch (error) {
    console.error('Erreur Admin getUniqueProjet:', error);
    res.status(400).json({ message: `Erreur lors de la récupération du projet : ${error.message}` });
  }
};
exports.getAllProjets = async (req, res) => {
  try {
    const filters = {
      statut: req.query.statut,
      secteur: req.query.secteur,
      estPublie: req.query.estPublie,
      date: req.query.date ? req.query.date : undefined,
    };

    const projets = await adminProjetService.getAllProjets(filters);
    res.json({ message: 'Liste des projets récupéré', data: projets, filters });
  } catch (error) {
    console.error('Erreur Admin getAllProjets :', error);
    res.status(400).json({ message: `Erreur lors de la récupération des projets : ${error.message}` });
  }
};

exports.listeDesProjets = async (req, res) => {
    try {
        console.log("Admin : Liste de tous les projets");
        const projets = await projetService.listerTousLesProjets();
        console.log(`[SUCCESS] ${projets.length} projets récupérés par l'admin`);
        res.json(projets);
    } catch (error) {
        console.error("Erreur admin lors de la récupération globale:", error.message);
        res.status(500).json({ error: error.message });
    }
}

    /**
     * Permet à l'admin d'approuver, rejeter ou demander des modifications sur un projet.
     */
    exports.changeStatusProjet = async(req, res) =>{
        try {
            const { id } = req.params;
            const { statut, suggestion } = req.body;

            if (!statut) {
                return res.status(400).json({ error: "Le nouveau statut est requis" });
            }

            console.log(`Modification du statut du projet ${id} vers : ${statut}`);
            const resultat = await projetService.changerStatutProjet(id, statut, suggestion);
            
            console.log(`[ADMIN SUCCESS] Projet ${id} mis à jour avec le statut : ${statut}`);
            res.json({
                message: "Statut du projet mis à jour avec succès",
                data: resultat
            });
        } catch (error) {
            console.error(`[ADMIN ERROR] Échec du changement de statut pour le projet ${req.params.id} :`, error.message);
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Suppression définitive d'un projet et de ses fichiers par l'administrateur.
     */
    exports.supprimerProjetParAdmin = async (req, res) =>  {
        try {
            const { id } = req.params;
            console.log(`[ADMIN WARNING] SUPPRESSION ENTRÉE par l'admin : ${req.user.userId} pour le projet : ${id}`);
            
            await projetService.supprimerProjetComplet(id);
            
            console.log(`[ADMIN SUCCESS] Projet ${id} définitivement supprimé`);
            res.json({ message: "Le projet et tous ses documents associés ont été supprimés définitivement" });
        } catch (error) {
            console.error(`[ADMIN ERROR] Échec de la suppression du projet ${req.params.id} :`, error.message);
            res.status(400).json({ error: error.message });
        }
    }
