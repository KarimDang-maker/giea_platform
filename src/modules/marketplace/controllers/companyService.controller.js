const companyServiceService = require('../services/companyService.service');
const { validationResult } = require('express-validator');

class CompanyServiceController {
    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const result = await companyServiceService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const filters = {};
            if (req.query.companyPageId) filters.companyPageId = req.query.companyPageId;
            if (req.query.isAvailable) filters.isAvailable = req.query.isAvailable === 'true';

            const result = await companyServiceService.findAll(filters);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const result = await companyServiceService.findById(req.params.id);
            if (!result) return res.status(404).json({ message: 'Service non trouvé' });
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const result = await companyServiceService.update(req.params.id, req.body);
            if (!result) return res.status(404).json({ message: 'Service non trouvé' });
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const success = await companyServiceService.delete(req.params.id);
            if (!success) return res.status(404).json({ message: 'Service non trouvé' });
            res.json({ message: 'Service supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CompanyServiceController();
