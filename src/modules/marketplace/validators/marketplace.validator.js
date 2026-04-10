const { body } = require('express-validator');

const companyPageValidator = [
    body('idUser').isString().notEmpty().withMessage('idUser est obligatoire'),
    body('name').isString().notEmpty().withMessage('Le nom est obligatoire'),
    body('description').isString().notEmpty().withMessage('La description est obligatoire'),
    body('secteurActivite').isString().notEmpty().withMessage('Le secteur d\'activité est obligatoire'),
    body('localisation').isString().notEmpty().withMessage('La localisation est obligatoire'),
    body('logoUrl').optional().isURL().withMessage('Logo URL invalide'),
    body('coverUrl').optional().isURL().withMessage('Cover URL invalide'),
];

const companyNewsValidator = [
    body('companyPageId').isString().notEmpty().withMessage('companyPageId est obligatoire'),
    body('title').isString().notEmpty().withMessage('Le titre est obligatoire'),
    body('content').isString().notEmpty().withMessage('Le contenu est obligatoire'),
    body('imageUrl').optional().isURL().withMessage('Image URL invalide'),
    body('publishedAt').optional().isISO8601().withMessage('Date de publication invalide'),
];

const companyServiceValidator = [
    body('companyPageId').isString().notEmpty().withMessage('companyPageId est obligatoire'),
    body('name').isString().notEmpty().withMessage('Le nom du service est obligatoire'),
    body('description').isString().notEmpty().withMessage('La description est obligatoire'),
    body('price').optional().isNumeric().withMessage('Le prix doit être un nombre'),
    body('isAvailable').optional().isBoolean().withMessage('Disponibilité invalide'),
];

module.exports = {
    companyPageValidator,
    companyNewsValidator,
    companyServiceValidator,
};
