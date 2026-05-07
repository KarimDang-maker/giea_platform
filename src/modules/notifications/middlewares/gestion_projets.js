const notificationQueue = require('../services/queue.service');
const { NotificationEvent, NotificationType } = require('../models/notification.model');

/**
 * Handles project management related notifications.
 */
const gestionProjetsNotify = {
    /**
     * Notifies about a new project.
     */
    projectCreated: async (targets, projectData) => {
        try {
            const event = new NotificationEvent({
                type: NotificationType.PROJECT_NEW,
                targets: targets,
                data: projectData
            });
            await notificationQueue.add(event.type, event);
        } catch (error) {
            console.error("Failed to enqueue PROJECT_NEW notification:", error);
        }
    },

    /**
     * Notifies about a project update.
     */
    projectUpdated: async (targets, projectData) => {
        try {
            const event = new NotificationEvent({
                type: NotificationType.PROJECT_UPDATE,
                targets: targets,
                data: projectData
            });
            await notificationQueue.add(event.type, event);
        } catch (error) {
            console.error("Failed to enqueue PROJECT_UPDATE notification:", error);
        }
    },

    /**
     * Notifies about new members added to a project.
     */
    membersAdded: async (targets, memberData) => {
        try {
            const event = new NotificationEvent({
                type: NotificationType.PROJECT_MEMBERS_ADD,
                targets: targets,
                data: memberData
            });
            await notificationQueue.add(event.type, event);
        } catch (error) {
            console.error("Failed to enqueue PROJECT_MEMBERS_ADD notification:", error);
        }
    },

    /**
     * Notifies about a new document added to a project.
     */
    documentAdded: async (targets, docData) => {
        try {
            const event = new NotificationEvent({
                type: NotificationType.PROJECT_DOCC_ADD,
                targets: targets,
                data: docData
            });
            await notificationQueue.add(event.type, event);
        } catch (error) {
            console.error("Failed to enqueue PROJECT_DOCC_ADD notification:", error);
        }
    }
};

module.exports = gestionProjetsNotify;
