const companyServiceService = require('../services/companyService.service');
const { validationResult } = require('express-validator');
const { sendError, sendSuccess } = require('../../../utils/helpers');

class CompanyServiceController {
    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendError(res, 'Validation errors', 400, errors.array());
        }

        try {
            const result = await companyServiceService.create(req.body);
            sendSuccess(res, result, 'Service créé avec succès', 201);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 400);
        }
    }

    async getAll(req, res) {
        try {
            const filters = {};
            if (req.query.companyPageId) filters.companyPageId = req.query.companyPageId;
            if (req.query.isAvailable) filters.isAvailable = req.query.isAvailable === 'true';

            const result = await companyServiceService.findAll(filters);
            sendSuccess(res, result);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async getById(req, res) {
        try {
            const result = await companyServiceService.findById(req.params.id);
            if (!result) return sendError(res, 'Service non trouvé', 404);
            sendSuccess(res, result);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async update(req, res) {
        try {
            const result = await companyServiceService.update(req.params.id, req.body);
            if (!result) return sendError(res, 'Service non trouvé', 404);
            sendSuccess(res, result, 'Service mis à jour avec succès');
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async delete(req, res) {
        try {
            const success = await companyServiceService.delete(req.params.id);
            if (!success) return sendError(res, 'Service non trouvé', 404);
            sendSuccess(res, null, 'Service supprimé avec succès');
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }
}

module.exports = new CompanyServiceController();
