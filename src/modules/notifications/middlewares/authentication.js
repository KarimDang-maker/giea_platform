const notificationQueue = require('../services/queue.service');
const { NotificationEvent, NotificationType } = require('../models/notification.model');
const userRepository = require('../../authentication/repositories/user.repository');

/**
 * Handles authentication related notifications.
 */
const authenticationNotify = {
    /**
     * Notifies a user to complete their profile.
     * @param {string} userId - ID of the user (email)
     */
    completeProfile: async (userId) => {
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
            console.error("Failed to enqueue COMPLETE_PROFILE notification:", error);
        }
    }
};

module.exports = authenticationNotify;
