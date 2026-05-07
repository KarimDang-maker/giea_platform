const notificationQueue = require('../services/queue.service');
const { NotificationEvent, NotificationType } = require('../models/notification.model');

/**
 * Handles marketplace related notifications.
 */
const marketplaceNotify = {
    /**
     * Notifies about a new company news.
     */
    companyNewsAdded: async (targets, newsData) => {
        try {
            const event = new NotificationEvent({
                type: NotificationType.COMPANIE_NEWS_ADD,
                targets: targets,
                data: newsData
            });
            await notificationQueue.add(event.type, event);
        } catch (error) {
            console.error("Failed to enqueue COMPANIE_NEWS_ADD notification:", error);
        }
    },

    /**
     * Notifies about a new company product.
     */
    productAdded: async (targets, productData) => {
        try {
            const event = new NotificationEvent({
                type: NotificationType.COMPANIE_PRODUCT_ADD,
                targets: targets,
                data: productData
            });
            await notificationQueue.add(event.type, event);
        } catch (error) {
            console.error("Failed to enqueue COMPANIE_PRODUCT_ADD notification:", error);
        }
    },

    /**
     * Notifies about a new company service.
     */
    serviceAdded: async (targets, serviceData) => {
        try {
            const event = new NotificationEvent({
                type: NotificationType.COMPANIE_SERVICE_ADD,
                targets: targets,
                data: serviceData
            });
            await notificationQueue.add(event.type, event);
        } catch (error) {
            console.error("Failed to enqueue COMPANIE_SERVICE_ADD notification:", error);
        }
    }
};

module.exports = marketplaceNotify;
