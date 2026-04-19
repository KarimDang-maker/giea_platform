const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projet.controller');
const { authMiddleware } = require('../../authentication/middlewares/auth.middleware');
const { roleMiddleware, adminOnly } = require('../../authentication/middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');
const estProprietaire = require('../middlewares/owner.middleware');

// --- Protection Globale : Toutes les routes ci-dessous nécessitent une connexion ---
router.use(authMiddleware);
const roleAcces = roleMiddleware('admin', 'entrepreneur');

// --- Routes Porteur de projet ---
router.post('/creer-projet', roleAcces, projetController.creerProjet);
router.get('/liste-projets', roleAcces, projetController.listerMesProjets);
router.get('/mon-projet/:id', roleAcces, estProprietaire, projetController.obtenirProjet);
router.put('/update-projet/:id', roleAcces, estProprietaire, projetController.mettreAJourInfos);
router.delete('/supprime-projet/:id', roleAcces, estProprietaire, projetController.supprimerProjet);

// Gestion des membres
router.post('/:id/membres', roleAcces, estProprietaire, projetController.ajouterMembre);
router.delete('/:id/membres/:membreId', roleAcces, estProprietaire, projetController.retirerMembre);

// Gestion des documents
router.post('/:id/documents', roleAcces, estProprietaire, upload.single('fichier'), projetController.ajouterDocument);
router.delete('/:id/documents/:docId', roleAcces, estProprietaire, projetController.supprimerDocument);

// --- Routes Admin ---
router.get('/admin/tous', adminOnly, projetController.listerTousLesProjets);
router.patch('/:id/statut', adminOnly, projetController.changerStatut);

module.exports = router;