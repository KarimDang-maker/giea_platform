const notificationQueue = require('../services/queue.service');
const { NotificationEvent, NotificationType } = require('../models/notification.model');
const userRepository = require('../../authentication/repositories/user.repository');

/**
 * Middleware function that formats the event and enqueues it.
 * Designed to be called without await so it doesn't block the HTTP response.
 * @param {string} userId - ID of the newly registered user (email)
 */
const notify = async (userId) => {
    try {
        const user = await userRepository.findById(userId);
        
        const data = user ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            date: new Date().toISOString()
        } : { date: new Date().toISOString() };

        const event = new NotificationEvent({
            type: NotificationType.COMPLETE_PROFILE,
            targets: userId,
            data: data
        });

        await notificationQueue.add(event.type, event);
    } catch (error) {
        console.error("Failed to format or enqueue notification event:", error);
    }
};

module.exports = { notify };
