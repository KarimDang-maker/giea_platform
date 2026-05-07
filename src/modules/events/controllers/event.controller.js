const eventService = require('../services/event.service');
const { sendError, sendSuccess } = require('../../../utils/helpers');

class EventController {
    async create(req, res) {
        try {
            const eventData = { 
                ...req.body, 
                creatorId: req.user.email, 
                creatorName: `${req.user.firstName} ${req.user.lastName}` 
            };
            const result = await eventService.create(eventData);
            sendSuccess(res, result, 'Événement créé avec succès et notifications envoyées', 201);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 400);
        }
    }

    async getAll(req, res) {
        try {
            const result = await eventService.findAll(req.query);
            sendSuccess(res, result);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async getById(req, res) {
        try {
            const result = await eventService.findById(req.params.id);
            if (!result) return sendError(res, 'Événement non trouvé', 404);
            sendSuccess(res, result);
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async update(req, res) {
        try {
            const result = await eventService.update(req.params.id, req.body);
            if (!result) return sendError(res, 'Événement non trouvé', 404);
            sendSuccess(res, result, 'Événement mis à jour avec succès');
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }

    async delete(req, res) {
        try {
            const success = await eventService.delete(req.params.id);
            if (!success) return sendError(res, 'Événement non trouvé', 404);
            sendSuccess(res, null, 'Événement supprimé avec succès');
        } catch (error) {
            sendError(res, error.message, error.statusCode || 500);
        }
    }
}

module.exports = new EventController();
