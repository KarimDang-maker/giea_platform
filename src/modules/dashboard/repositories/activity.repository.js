const admin = require('firebase-admin');
const ActivityModel = require('../models/activity.model');

/**
 * ActivityRepository
 * Handles all activity-related database operations
 */
class ActivityRepository {
  static instance = null;

  // Singleton pattern
  static getInstance() {
    if (!ActivityRepository.instance) {
      ActivityRepository.instance = new ActivityRepository();
    }
    return ActivityRepository.instance;
  }

  /**
   * Create activity
   */
  async create(activityData) {
    try {
      const db = admin.firestore();
      const activity = ActivityModel.create(activityData);
      const docRef = await db.collection('activities').add(activity.toJSON());
      activity.id = docRef.id;
      return activity;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  /**
   * Get recent activities for a user
   */
  async getRecentActivities(userId, limit = 10) {
    try {
      const db = admin.firestore();
      const snapshot = await db
        .collection('activities')
        .where('userId', '==', userId)
        .limit(limit * 3) // Fetch more to account for sorting
        .get();

      const activities = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        activities.push(data);
      });
      
      // Sort by timestamp descending in application code
      activities.sort((a, b) => {
        const timeA = new Date(a.timestamp || 0).getTime();
        const timeB = new Date(b.timestamp || 0).getTime();
        return timeB - timeA;
      });
      
      return activities.slice(0, limit);
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
      const db = admin.firestore();
      const snapshot = await db
        .collection('activities')
        .where('userId', '==', userId)
        .where('type', '==', type)
        .limit(limit * 3)
        .get();

      const activities = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        activities.push(data);
      });
      
      // Sort by timestamp descending in application code
      activities.sort((a, b) => {
        const timeA = new Date(a.timestamp || 0).getTime();
        const timeB = new Date(b.timestamp || 0).getTime();
        return timeB - timeA;
      });
      
      return activities.slice(0, limit);
    } catch (error) {
      console.error('Error fetching activities by type:', error);
      throw error;
    }
  }

  /**
   * Get unread activities
   */
  async getUnreadActivities(userId) {
    try {
      const db = admin.firestore();
      const snapshot = await db
        .collection('activities')
        .where('userId', '==', userId)
        .where('isRead', '==', false)
        .get();

      const activities = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        activities.push(data);
      });
      
      // Sort by timestamp descending in application code
      activities.sort((a, b) => {
        const timeA = new Date(a.timestamp || 0).getTime();
        const timeB = new Date(b.timestamp || 0).getTime();
        return timeB - timeA;
      });
      
      return activities;
    } catch (error) {
      console.error('Error fetching unread activities:', error);
      throw error;
    }
  }

  /**
   * Mark activity as read
   */
  async markAsRead(activityId) {
    try {
      const db = admin.firestore();
      await db.collection('activities').doc(activityId).update({
        isRead: true
      });
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
      const db = admin.firestore();
      const snapshot = await db
        .collection('activities')
        .where('userId', '==', userId)
        .where('isRead', '==', false)
        .get();

      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.update(doc.ref, { isRead: true });
      });
      await batch.commit();
      return true;
    } catch (error) {
      // Handle Firestore index not found error gracefully (error code 9 = FAILED_PRECONDITION)
      if (error.code === 9 || error.message?.includes('FAILED_PRECONDITION')) {
        console.warn('Firestore composite index not yet created. Skipping mark all as read.');
        return false;
      }
      console.error('Error marking all activities as read:', error);
      throw error;
    }
  }

  /**
   * Delete old activities
   */
  async deleteOldActivities(userId, days = 90) {
    try {
      const db = admin.firestore();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const snapshot = await db
        .collection('activities')
        .where('userId', '==', userId)
        .where('timestamp', '<', cutoffDate)
        .get();

      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      return snapshot.size;
    } catch (error) {
      console.error('Error deleting old activities:', error);
      throw error;
    }
  }

  /**
   * Get activity by ID
   */
  async findById(activityId) {
    try {
      const db = admin.firestore();
      const doc = await db.collection('activities').doc(activityId).get();
      if (!doc.exists) {
        return null;
      }
      const data = doc.data();
      data.id = doc.id;
      return data;
    } catch (error) {
      console.error('Error fetching activity by ID:', error);
      throw error;
    }
  }
}

module.exports = ActivityRepository.getInstance();
