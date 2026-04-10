const companyPageService = require('../services/companyPage.service');
const { validationResult } = require('express-validator');

class CompanyPageController {
    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const result = await companyPageService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const filters = {};
            if (req.query.idUser) filters.idUser = req.query.idUser;

            const result = await companyPageService.findAll(filters);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const result = await companyPageService.findById(req.params.id);
            if (!result) return res.status(404).json({ message: 'Page non trouvée' });
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const result = await companyPageService.update(req.params.id, req.body);
            if (!result) return res.status(404).json({ message: 'Page non trouvée' });
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const success = await companyPageService.delete(req.params.id);
            if (!success) return res.status(404).json({ message: 'Page non trouvée' });
            res.json({ message: 'Page supprimée avec succès (cascade)' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CompanyPageController();
