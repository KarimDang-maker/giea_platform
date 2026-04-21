const eventService = require('../services/event.service');
const eventSessionService = require('../services/eventSession.service');
const eventRegistrationService = require('../services/eventRegistration.service');
const sessionParticipantService = require('../services/sessionParticipant.service');

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Accès refusé : Droits administrateur requis',
            code: 'FORBIDDEN_ADMIN_ONLY'
        });
    }
    next();
};

const isAdminOrCreator = async (req, res, next) => {
    try {
        const { eventId, id } = req.params;
        const targetId = eventId || id;

        if (!targetId) {
            return res.status(400).json({ message: 'ID d\'événement manquant' });
        }

        const event = await eventService.findById(targetId);
        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }

        if (req.user.role === 'admin' || req.user.userId === event.createdBy) {
            return next();
        }

        res.status(403).json({
            message: 'Accès refusé : Vous devez être admin ou le créateur de cet événement',
            code: 'FORBIDDEN_OWNER_OR_ADMIN'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const isAdminOrEventCreatorForSession = async (req, res, next) => {
    try {
        const { sessionId, id } = req.params;
        const targetId = sessionId || id;

        if (!targetId) {
            return res.status(400).json({ message: 'ID de session manquant' });
        }

        const session = await eventSessionService.findById(targetId);
        if (!session) {
            return res.status(404).json({ message: 'Session non trouvée' });
        }

        const event = await eventService.findById(session.eventId);

        if (req.user.role === 'admin' || (event && req.user.userId === event.createdBy)) {
            return next();
        }

        res.status(403).json({
            message: 'Accès refusé : Vous devez être admin ou le créateur de l\'événement parent',
            code: 'FORBIDDEN_OWNER_OR_ADMIN'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const isAdminOrCreatorOrParticipantOwner = async (req, res, next) => {
    try {
        const { eventId, id } = req.params;
        const registrationId = id;

        if (!registrationId) {
            return res.status(400).json({ message: 'ID d\'inscription manquant' });
        }

        const registration = await eventRegistrationService.findById(registrationId);
        if (!registration) {
            return res.status(404).json({ message: 'Inscription non trouvée' });
        }

        const event = await eventService.findById(registration.eventId);

        // Check if Admin, Creator, or Owner of the registration
        const isAdmin = req.user.role === 'admin';
        const isCreator = event && req.user.userId === event.createdBy;
        const isOwner = registration.idUser === req.user.userId;

        if (isAdmin || isCreator || isOwner) {
            return next();
        }

        res.status(403).json({
            message: 'Accès refusé : Vous n\'avez pas les droits de gérer cette inscription',
            code: 'FORBIDDEN_MANAGEMENT'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const isAdminOrCreatorOrSessionParticipantOwner = async (req, res, next) => {
    try {
        const { sessionId, id } = req.params;
        const participantId = id;

        if (!participantId) {
            return res.status(400).json({ message: 'ID de participation manquant' });
        }

        const participant = await sessionParticipantService.findById(participantId);
        if (!participant) {
            return res.status(404).json({ message: 'Participation non trouvée' });
        }

        const session = await eventSessionService.findById(participant.sessionId);
        const event = await eventService.findById(session.eventId);

        // Check if Admin, Event Creator, or Owner of the participant entry
        const isAdmin = req.user.role === 'admin';
        const isCreator = event && req.user.userId === event.createdBy;
        const isOwner = participant.idUser === req.user.userId;

        if (isAdmin || isCreator || isOwner) {
            return next();
        }

        res.status(403).json({
            message: 'Accès refusé : Vous n\'avez pas les droits de gérer cette participation',
            code: 'FORBIDDEN_MANAGEMENT'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    isAdmin,
    isAdminOrCreator,
    isAdminOrEventCreatorForSession,
    isAdminOrCreatorOrParticipantOwner,
    isAdminOrCreatorOrSessionParticipantOwner
};
