const companyProductService = require('../services/companyProduct.service');
const { validationResult } = require('express-validator');
const { sendError, sendSuccess } = require('../../../utils/helpers');

class CompanyProductController {
    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendError(res, 'Validation errors', 400, errors.array());
        }

        try {
            const result = await companyProductService.create(req.body);
            sendSuccess(res, result, 'Produit créé avec succès', 201);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 400);
        }
    }

    async getAll(req, res) {
        try {
            const filters = {};
            if (req.query.companyPageId) filters.companyPageId = req.query.companyPageId;
            if (req.query.available) filters.available = req.query.available === 'true';
            if (req.query.category) filters.category = req.query.category;

            const result = await companyProductService.findAll(filters);
            sendSuccess(res, result);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async getById(req, res) {
        try {
            const result = await companyProductService.findById(req.params.id);
            if (!result) return sendError(res, 'Produit non trouvé', 404);
            sendSuccess(res, result);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async update(req, res) {
        try {
            const result = await companyProductService.update(req.params.id, req.body);
            if (!result) return sendError(res, 'Produit non trouvé', 404);
            sendSuccess(res, result, 'Produit mis à jour avec succès');
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async delete(req, res) {
        try {
            const success = await companyProductService.delete(req.params.id);
            if (!success) return sendError(res, 'Produit non trouvé', 404);
            sendSuccess(res, null, 'Produit supprimé avec succès');
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }
}

module.exports = new CompanyProductController();
