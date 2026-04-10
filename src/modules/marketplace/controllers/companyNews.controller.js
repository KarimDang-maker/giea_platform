const companyNewsService = require('../services/companyNews.service');
const { validationResult } = require('express-validator');

class CompanyNewsController {
    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const result = await companyNewsService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const filters = {};
            if (req.query.companyPageId) filters.companyPageId = req.query.companyPageId;

            const result = await companyNewsService.findAll(filters);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const result = await companyNewsService.findById(req.params.id);
            if (!result) return res.status(404).json({ message: 'Actu non trouvée' });
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const result = await companyNewsService.update(req.params.id, req.body);
            if (!result) return res.status(404).json({ message: 'Actu non trouvée' });
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const success = await companyNewsService.delete(req.params.id);
            if (!success) return res.status(404).json({ message: 'Actu non trouvée' });
            res.json({ message: 'Actu supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CompanyNewsController();
