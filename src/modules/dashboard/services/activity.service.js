const ActivityRepository = require('../repositories/activity.repository');
const { ActivityModel } = require('../models');

/**
 * ActivityService
 * Business logic for activity management
 */
class ActivityService {
  static instance = null;

  static getInstance() {
    if (!ActivityService.instance) {
      ActivityService.instance = new ActivityService();
    }
    return ActivityService.instance;
  }

  /**
   * Record user activity
   */
  async recordActivity(activityData) {
    try {
      const activity = await ActivityRepository.create(activityData);
      return activity;
    } catch (error) {
      console.error('Error recording activity:', error);
      throw error;
    }
  }

  /**
   * Get user's recent activities
   */
  async getRecentActivities(userId, limit = 10) {
    try {
      const activities = await ActivityRepository.getRecentActivities(userId, limit);
      return activities;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }

  /**
   * Get activities by type
   */
  async getActivitiesByType(userId, type, limit = 20) {
    try {
      const activities = await ActivityRepository.getActivitiesByType(userId, type, limit);
      return activities;
    } catch (error) {
      console.error('Error fetching activities by type:', error);
      throw error;
    }
  }

  /**
   * Get unread activities count
   */
  async getUnreadCount(userId) {
    try {
      const activities = await ActivityRepository.getUnreadActivities(userId);
      return activities.length;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  /**
   * Mark activity as read
   */
  async markAsRead(activityId) {
    try {
      await ActivityRepository.markAsRead(activityId);
      return true;
    } catch (error) {
      console.error('Error marking activity as read:', error);
      throw error;
    }
  }

  /**
   * Mark all user activities as read
   */
  async markAllAsRead(userId) {
    try {
      await ActivityRepository.markAllAsRead(userId);
      return true;
    } catch (error) {
      console.error('Error marking all activities as read:', error);
      throw error;
    }
  }

  /**
   * Clean up old activities
   */
  async cleanupOldActivities(userId, days = 90) {
    try {
      const deleted = await ActivityRepository.deleteOldActivities(userId, days);
      return deleted;
    } catch (error) {
      console.error('Error cleaning up old activities:', error);
      throw error;
    }
  }
}

module.exports = ActivityService.getInstance();
