const companyPageService = require('../services/companyPage.service');
const { validationResult } = require('express-validator');
const { sendError, sendSuccess } = require('../../../utils/helpers');

class CompanyPageController {
    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendError(res, 'Validation errors', 400, errors.array());
        }

        try {
            const result = await companyPageService.create(req.body);
            sendSuccess(res, result, 'Page créée avec succès', 201);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 400);
        }
    }

    async getAll(req, res) {
        try {
            const filters = {};
            if (req.query.idUser) filters.idUser = req.query.idUser;

            const result = await companyPageService.findAll(filters);
            sendSuccess(res, result);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async getById(req, res) {
        try {
            const result = await companyPageService.findById(req.params.id);
            if (!result) return sendError(res, 'Page non trouvée', 404);
            sendSuccess(res, result);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async update(req, res) {
        try {
            const result = await companyPageService.update(req.params.id, req.body);
            if (!result) return sendError(res, 'Page non trouvée', 404);
            sendSuccess(res, result, 'Page mise à jour avec succès');
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async delete(req, res) {
        try {
            const success = await companyPageService.delete(req.params.id);
            if (!success) return sendError(res, 'Page non trouvée', 404);
            sendSuccess(res, null, 'Page supprimée avec succès (cascade)');
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }
}

module.exports = new CompanyPageController();
