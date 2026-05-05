const DashboardRepository = require('../repositories/dashboard.repository');
const ActivityService = require('./activity.service');
const RecommendationService = require('./recommendation.service');
const { DashboardModel } = require('../models');

/**
 * DashboardService
 * Business logic for dashboard generation and management
 */
class DashboardService {
  static instance = null;

  static getInstance() {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  /**
   * Generate comprehensive dashboard for user
   */
  async generateDashboard(userId, userName, userRole) {
    try {
      // Validate userId is not empty
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required to generate dashboard');
      }

      const dashboard = new DashboardModel();
      dashboard.setDashboardData(userId, userName, userRole);

      // Get user statistics
      const stats = await DashboardRepository.getUserStats(userId);
      if (stats) {
        dashboard.updateStatistics(stats);
      }

      // Get recent activities
      const activities = await ActivityService.getRecentActivities(userId, 10);
      dashboard.recentActivities = activities;

      // Get recommendations
      const recommendations = await RecommendationService.getActiveRecommendations(
        userId,
        5
      );
      dashboard.recommendations = recommendations;

      // Set quick links based on role
      dashboard.setQuickLinks(this.getQuickLinksByRole(userRole));

      // Save dashboard
      await DashboardRepository.saveDashboard(userId, dashboard.toJSON());

      return dashboard;
    } catch (error) {
      console.error('Error generating dashboard:', error);
      throw error;
    }
  }

  /**
   * Get user dashboard
   */
  async getDashboard(userId, userName, userRole) {
    try {
      let dashboard = await DashboardRepository.getDashboard(userId);

      if (!dashboard) {
        // Generate new dashboard if doesn't exist
        dashboard = await this.generateDashboard(userId, userName, userRole);
      } else {
        dashboard = new DashboardModel();
        dashboard.userId = dashboard.userId || userId;
        dashboard.userName = dashboard.userName || userName;
        dashboard.userRole = dashboard.userRole || userRole;
      }

      return dashboard;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  }

  /**
   * Refresh dashboard data
   */
  async refreshDashboard(userId, userName, userRole) {
    try {
      return await this.generateDashboard(userId, userName, userRole);
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      throw error;
    }
  }

  /**
   * Get quick links based on user role
   */
  getQuickLinksByRole(role) {
    const baseLinks = [
      {
        title: 'Dashboard',
        description: 'View your dashboard',
        path: '/dashboard',
        icon: 'dashboard'
      },
      {
        title: 'Profile',
        description: 'Edit your profile',
        path: '/profile',
        icon: 'person'
      }
    ];

    const roleSpecificLinks = {
      student: [
        { title: 'Projects', description: 'Browse projects', path: '/projects', icon: 'folder' },
        {
          title: 'Resources',
          description: 'Learning resources',
          path: '/resources',
          icon: 'library_books'
        },
        { title: 'Skills', description: 'Manage skills', path: '/skills', icon: 'star' }
      ],
      entrepreneur: [
        { title: 'My Projects', description: 'Manage projects', path: '/my-projects', icon: 'folder' },
        {
          title: 'Investors',
          description: 'Find investors',
          path: '/investors',
          icon: 'attach_money'
        },
        { title: 'Marketplace', description: 'Services & products', path: '/marketplace', icon: 'shopping_cart' }
      ],
      company: [
        {
          title: 'Talent Search',
          description: 'Find professionals',
          path: '/talent',
          icon: 'groups'
        },
        { title: 'Jobs', description: 'Manage job posts', path: '/jobs', icon: 'work' },
        { title: 'Marketplace', description: 'Products & services', path: '/marketplace', icon: 'shopping_cart' }
      ],
      investor: [
        { title: 'Projects', description: 'Investment opportunities', path: '/projects', icon: 'trending_up' },
        {
          title: 'Portfolio',
          description: 'Manage investments',
          path: '/portfolio',
          icon: 'assessment'
        }
      ],
      mentor: [
        {
          title: 'Mentees',
          description: 'Manage mentees',
          path: '/mentees',
          icon: 'school'
        },
        { title: 'Resources', description: 'Mentoring resources', path: '/resources', icon: 'library_books' }
      ],
      admin: [
        { title: 'Reports', description: 'View reports', path: '/reports', icon: 'assessment' },
        {
          title: 'Statistics',
          description: 'View statistics',
          path: '/statistics',
          icon: 'show_chart'
        },
        { title: 'Users', description: 'Manage users', path: '/users', icon: 'admin_panel_settings' }
      ]
    };

    return [...baseLinks, ...(roleSpecificLinks[role] || [])];
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStatistics(userId) {
    try {
      // Validate userId is not empty
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required to fetch statistics');
      }

      const stats = await DashboardRepository.getUserStats(userId);
      return stats;
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      throw error;
    }
  }

  /**
   * Record activity
   */
  async recordActivity(activityData) {
    try {
      return await ActivityService.recordActivity(activityData);
    } catch (error) {
      console.error('Error recording activity:', error);
      throw error;
    }
  }

  /**
   * Generate new recommendations
   */
  async generateNewRecommendations(userId, userRole) {
    try {
      return await RecommendationService.generateRecommendations(userId, userRole);
    } catch (error) {
      console.error('Error generating new recommendations:', error);
      throw error;
    }
  }
}

module.exports = DashboardService.getInstance();
