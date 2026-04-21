const companyNewsService = require('../services/companyNews.service');
const { validationResult } = require('express-validator');
const { sendError, sendSuccess } = require('../../../utils/helpers');

class CompanyNewsController {
    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendError(res, 'Validation errors', 400, errors.array());
        }

        try {
            const result = await companyNewsService.create(req.body);
            sendSuccess(res, result, 'Actualité créée avec succès', 201);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 400);
        }
    }

    async getAll(req, res) {
        try {
            const filters = {};
            if (req.query.companyPageId) filters.companyPageId = req.query.companyPageId;

            const result = await companyNewsService.findAll(filters);
            sendSuccess(res, result);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async getById(req, res) {
        try {
            const result = await companyNewsService.findById(req.params.id);
            if (!result) return sendError(res, 'Actualité non trouvée', 404);
            sendSuccess(res, result);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async update(req, res) {
        try {
            const result = await companyNewsService.update(req.params.id, req.body);
            if (!result) return sendError(res, 'Actualité non trouvée', 404);
            sendSuccess(res, result, 'Actualité mise à jour avec succès');
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async delete(req, res) {
        try {
            const success = await companyNewsService.delete(req.params.id);
            if (!success) return sendError(res, 'Actualité non trouvée', 404);
            sendSuccess(res, null, 'Actualité supprimée avec succès');
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }
}

module.exports = new CompanyNewsController();
