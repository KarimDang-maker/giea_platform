const notificationRepository = require('../repositories/notification.repository');
const Notification = require('../models/notification.model');

class NotificationService {
  async createNotification(data) {
    const notification = new Notification(data);
    
    // Convert to plain object for Firestore
    const notificationData = {
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt
    };
    
    return await notificationRepository.create(notificationData);
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
