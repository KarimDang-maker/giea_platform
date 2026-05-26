const express = require('express');
const adminProjetController = require('../controllers/adminProjet.controller');
const { authMiddleware } = require('../../authentication/middleware/auth.middleware');
const { authValidationRules, handleAuthValidationErrors } = require('../../authentication/utils/validators');
const { adminOnly } = require('../../authentication/middleware/role.middleware');
const upload = require('../../../config/multer');

const routerr = express.Router();

//toutes les routes sont protégées et reservées à l'admin
routerr.use(authMiddleware);
routerr.use(adminOnly);

routerr.get('/projet/details/:id', adminProjetController.getUnicProjet)
routerr.get('/projets/touslister', adminProjetController.getAllProjets);
routerr.patch('/projet/:id/status', adminProjetController.changeStatusProjet);
routerr.delete('/projet-supprime/:id', adminProjetController.supprimerProjetParAdmin);

module.exports = routerr;