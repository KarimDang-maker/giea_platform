const DashboardService = require('../services/dashboard.service');

/**
 * Dashboard Controller
 * HTTP request handlers for dashboard endpoints
 */
const dashboardController = {
  /**
   * GET /api/dashboard
   * Get user's dashboard
   */
  getDashboard: async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?.email;
      const userName = req.user?.email;
      const userRole = req.user?.role;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const dashboard = await DashboardService.getDashboard(userId, userName, userRole);

      res.status(200).json({
        success: true,
        data: dashboard,
        message: 'Dashboard retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getDashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard',
        error: error.message
      });
    }
  },

  /**
   * POST /api/dashboard/refresh
   * Refresh dashboard data
   */
  refreshDashboard: async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?.email;
      const userName = req.user?.email;
      const userRole = req.user?.role;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const dashboard = await DashboardService.refreshDashboard(userId, userName, userRole);

      res.status(200).json({
        success: true,
        data: dashboard,
        message: 'Dashboard refreshed successfully'
      });
    } catch (error) {
      console.error('Error in refreshDashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to refresh dashboard',
        error: error.message
      });
    }
  },

  /**
   * GET /api/dashboard/statistics
   * Get dashboard statistics
   */
  getStatistics: async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?.email;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const statistics = await DashboardService.getDashboardStatistics(userId);

      res.status(200).json({
        success: true,
        data: statistics,
        message: 'Statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getStatistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  }
};

module.exports = dashboardController;
