const ActivityService = require('../services/activity.service');

/**
 * Activity Controller
 * HTTP request handlers for activity endpoints
 */
const activityController = {
  /**
   * GET /api/dashboard/activities
   * Get recent activities
   */
  getRecentActivities: async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?.email;
      const limit = parseInt(req.query.limit) || 10;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const activities = await ActivityService.getRecentActivities(userId, limit);

      res.status(200).json({
        success: true,
        data: activities,
        message: 'Activities retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getRecentActivities:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch activities',
        error: error.message
      });
    }
  },

  /**
   * GET /api/dashboard/activities/type/:type
   * Get activities by type
   */
  getActivitiesByType: async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?.email;
      const { type } = req.params;
      const limit = parseInt(req.query.limit) || 20;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const activities = await ActivityService.getActivitiesByType(userId, type, limit);

      res.status(200).json({
        success: true,
        data: activities,
        message: 'Activities retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getActivitiesByType:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch activities',
        error: error.message
      });
    }
  },

  /**
   * GET /api/dashboard/activities/unread/count
   * Get unread activities count
   */
  getUnreadCount: async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?.email;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const count = await ActivityService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        data: { unreadCount: count },
        message: 'Unread count retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch unread count',
        error: error.message
      });
    }
  },

  /**
   * POST /api/dashboard/activities/:id/read
   * Mark activity as read
   */
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;

      await ActivityService.markAsRead(id);

      res.status(200).json({
        success: true,
        message: 'Activity marked as read'
      });
    } catch (error) {
      console.error('Error in markAsRead:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark activity as read',
        error: error.message
      });
    }
  },

  /**
   * POST /api/dashboard/activities/read-all
   * Mark all activities as read
   */
  markAllAsRead: async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?.email;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      await ActivityService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: 'All activities marked as read'
      });
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark all activities as read',
        error: error.message
      });
    }
  },

  /**
   * POST /api/dashboard/activities/cleanup
   * Clean up old activities
   */
  cleanupOldActivities: async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?.email;
      const { days = 90 } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const deleted = await ActivityService.cleanupOldActivities(userId, days);

      res.status(200).json({
        success: true,
        data: { deletedCount: deleted },
        message: `${deleted} old activities deleted`
      });
    } catch (error) {
      console.error('Error in cleanupOldActivities:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cleanup old activities',
        error: error.message
      });
    }
  }
};

module.exports = activityController;
