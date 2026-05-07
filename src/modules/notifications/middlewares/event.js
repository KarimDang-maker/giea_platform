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
            console.log('[EventMiddleware] Enqueuing notification for event:', eventData.title);
            const event = new NotificationEvent({
                type: NotificationType.PLATFORM_EVENT_CREATED,
                targets: [], // Empty targets to signal "all users" to the worker
                data: eventData
            });
            await notificationQueue.add(event.type, event);
            console.log('[EventMiddleware] Notification enqueued successfully');
        } catch (error) {
            console.error("[EventMiddleware] Failed to enqueue PLATFORM_EVENT_CREATED notification:", error);
        }
    }
};

module.exports = eventNotify;
