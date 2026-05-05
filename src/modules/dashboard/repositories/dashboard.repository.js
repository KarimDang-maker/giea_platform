const admin = require('firebase-admin');

/**
 * DashboardRepository
 * Handles dashboard data aggregation and storage
 */
class DashboardRepository {
  static instance = null;

  // Singleton pattern
  static getInstance() {
    if (!DashboardRepository.instance) {
      DashboardRepository.instance = new DashboardRepository();
    }
    return DashboardRepository.instance;
  }

  /**
   * Get or create user dashboard
   */
  async getDashboard(userId) {
    try {
      const db = admin.firestore();
      let doc = await db.collection('dashboards').doc(userId).get();
      if (doc.exists) {
        const data = doc.data();
        data.id = doc.id;
        return data;
      }
      // Create new dashboard if doesn't exist
      return null;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  }

  /**
   * Save dashboard data
   */
  async saveDashboard(userId, dashboardData) {
    try {
      const db = admin.firestore();
      await db.collection('dashboards').doc(userId).set(dashboardData, { merge: true });
      const doc = await db.collection('dashboards').doc(userId).get();
      const data = doc.data();
      data.id = doc.id;
      return data;
    } catch (error) {
      console.error('Error saving dashboard:', error);
      throw error;
    }
  }

  /**
   * Update dashboard statistics
   */
  async updateStatistics(userId, statistics) {
    try {
      const db = admin.firestore();
      await db.collection('dashboards').doc(userId).update({
        statistics: statistics,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error updating dashboard statistics:', error);
      throw error;
    }
  }

  /**
   * Get user statistics summary
   */
  async getUserStats(userId) {
    try {
      const db = admin.firestore();
      // Get user from users collection
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        return null;
      }

      const userData = userDoc.data();

      // Get user's projects count
      const projectsSnapshot = await db
        .collection('projets')
        .where('userId', '==', userId)
        .get();

      // Get user's resources count
      const resourcesSnapshot = await db
        .collection('ressources')
        .where('userId', '==', userId)
        .get();

      // Get user profile completion
      const profileData = {
        firstName: userData.firstName ? true : false,
        lastName: userData.lastName ? true : false,
        email: userData.email ? true : false,
        phoneNumber: userData.phoneNumber ? true : false,
        profilePicture: userData.profilePicture ? true : false,
        bio: userData.bio ? true : false
      };

      const profileComplete = Object.values(profileData).filter(Boolean).length;
      const profilePercentage = (profileComplete / Object.keys(profileData).length) * 100;

      return {
        totalProjects: projectsSnapshot.size,
        totalResources: resourcesSnapshot.size,
        profileCompletion: Math.round(profilePercentage),
        role: userData.role,
        joinedDate: userData.createdAt
      };
    } catch (error) {
      console.error('Error getting user statistics:', error);
      throw error;
    }
  }

  /**
   * Add notification to dashboard
   */
  async addNotification(userId, notification) {
    try {
      const db = admin.firestore();
      const ref = db.collection('dashboards').doc(userId);
      await ref.update({
        notifications: db.FieldValue.arrayUnion(notification),
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  }

  /**
   * Clear notifications
   */
  async clearNotifications(userId) {
    try {
      const db = admin.firestore();
      await db.collection('dashboards').doc(userId).update({
        notifications: [],
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  }
}

module.exports = DashboardRepository.getInstance();
