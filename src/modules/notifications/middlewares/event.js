const notificationQueue = require('../services/queue.service');
const { NotificationEvent, NotificationType } = require('../models/notification.model');

/**
 * Handles event related notifications.
 */
const eventNotify = {
    /**
     * Notifies about a new platform event.
     */
    eventCreated: async (eventData) => {
        try {
            const event = new NotificationEvent({
                type: NotificationType.PLATFORM_EVENT_CREATED,
                targets: [], // Empty targets to signal "all users" to the worker
                data: eventData
            });
            await notificationQueue.add(event.type, event);
        } catch (error) {
            console.error("Failed to enqueue PLATFORM_EVENT_CREATED notification:", error);
        }
    }
};

module.exports = eventNotify;
