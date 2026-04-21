const projetService = require('../services/projet.service');

/**
 * Middleware pour vérifier si l'utilisateur est le propriétaire du projet
 * ou s'il est administrateur.
 */
const estProprietaire = async (req, res, next) => {
    try {
        const projetId = req.params.id;
        // Adaptation : userId dans le token est l'email
        const userId = req.user.userId; 
        const userRole = req.user.role;

        const projet = await projetService.obtenirProjet(projetId);

        if (userRole !== 'admin' && projet.porteurId !== userId) {
            return res.status(403).json({ error: "Accès refusé : vous n'êtes pas le propriétaire de ce projet." });
        }

        // On attache le projet à la requête pour éviter au contrôleur de le re-chercher en base
        req.projet = projet;
        next();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = estProprietaire;