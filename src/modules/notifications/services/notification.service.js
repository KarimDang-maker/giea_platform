const notificationRepository = require('../repositories/notification.repository');
const { Notifications } = require('../models/notification.model');

class NotificationService {
  async createNotification(data) {
    console.log('[NotificationService] Creating in-app notification for user:', data.userId);
    const notification = new Notifications(data);
    const notificationData = {
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt
    };
    
    const result = await notificationRepository.create(notificationData);
    console.log('[NotificationService] In-app notification created, ID:', result.id);
    return result;
  }

  async getUserNotifications(userId) {
    return await notificationRepository.findAllByUserId(userId);
  }

  async getNotificationById(id) {
    return await notificationRepository.findById(id);
  }

  async markAsRead(id) {
    return await notificationRepository.update(id, { read: true });
  }

  async deleteNotification(id) {
    return await notificationRepository.delete(id);
  }
}

module.exports = new NotificationService();
