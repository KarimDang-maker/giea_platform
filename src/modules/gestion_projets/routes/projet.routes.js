const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projet.controller');
const { verifyToken } = require('../../authentication/middlewares/auth.middleware');
const { checkRole } = require('../../authentication/middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

// --- Protection Globale : Toutes les routes ci-dessous nécessitent une connexion ---
router.use(verifyToken);

// --- Routes Porteur de projet ---
router.post('/', projetController.creerProjet);
router.get('/mes-projets', projetController.listerMesProjets);
router.get('/:id', projetController.obtenirProjet);
router.put('/:id', projetController.mettreAJourInfos);
router.delete('/:id', checkRole(['admin', 'porteur']), projetController.supprimerProjet);

// Gestion des membres
router.post('/:id/membres', projetController.ajouterMembre);
router.delete('/:id/membres/:membreId', projetController.retirerMembre);

// Gestion des documents
router.post('/:id/documents', upload.single('fichier'), projetController.ajouterDocument);
router.delete('/:id/documents/:docId', projetController.supprimerDocument);

// --- Routes Admin ---
router.get('/admin/tous', checkRole(['admin']), projetController.listerTousLesProjets);
router.patch('/:id/statut', checkRole(['admin']), projetController.changerStatut);

module.exports = router;