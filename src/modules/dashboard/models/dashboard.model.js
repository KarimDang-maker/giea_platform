/**
 * Dashboard Model
 * Represents the complete user dashboard with activities, recommendations, and quick links
 */
class DashboardModel {
  constructor() {
    this.userId = null;
    this.userName = null;
    this.userRole = null;
    this.recentActivities = []; // Array of Activity objects
    this.recommendations = []; // Array of Recommendation objects
    this.quickLinks = []; // Array of quick access links
    this.statistics = {}; // User's personal statistics
    this.notifications = []; // Pending notifications
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Set dashboard data
  setDashboardData(userId, userName, userRole) {
    this.userId = userId;
    this.userName = userName;
    this.userRole = userRole;
    this.updatedAt = new Date();
  }

  // Add recent activity
  addActivity(activity) {
    if (!this.recentActivities) {
      this.recentActivities = [];
    }
    this.recentActivities.push(activity);
    this.updatedAt = new Date();
  }

  // Add recommendation
  addRecommendation(recommendation) {
    if (!this.recommendations) {
      this.recommendations = [];
    }
    this.recommendations.push(recommendation);
    this.updatedAt = new Date();
  }

  // Set quick links based on user role
  setQuickLinks(links) {
    this.quickLinks = links;
    this.updatedAt = new Date();
  }

  // Update statistics
  updateStatistics(stats) {
    this.statistics = {
      ...this.statistics,
      ...stats
    };
    this.updatedAt = new Date();
  }

  // Add notification
  addNotification(notification) {
    if (!this.notifications) {
      this.notifications = [];
    }
    this.notifications.push(notification);
    this.updatedAt = new Date();
  }

  // Convert to JSON
  toJSON() {
    return {
      userId: this.userId,
      userName: this.userName,
      userRole: this.userRole,
      recentActivities: this.recentActivities,
      recommendations: this.recommendations,
      quickLinks: this.quickLinks,
      statistics: this.statistics,
      notifications: this.notifications,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = DashboardModel;
