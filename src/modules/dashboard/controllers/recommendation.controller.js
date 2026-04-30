const RecommendationService = require('../services/recommendation.service');

/**
 * Recommendation Controller
 * HTTP request handlers for recommendation endpoints
 */
const recommendationController = {
  /**
   * GET /api/dashboard/recommendations
   * Get active recommendations
   */
  getRecommendations: async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?.email;
      const limit = parseInt(req.query.limit) || 5;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const recommendations = await RecommendationService.getActiveRecommendations(userId, limit);

      res.status(200).json({
        success: true,
        data: recommendations,
        message: 'Recommendations retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getRecommendations:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch recommendations',
        error: error.message
      });
    }
  },

  /**
   * GET /api/dashboard/recommendations/type/:type
   * Get recommendations by type
   */
  getRecommendationsByType: async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?.email;
      const { type } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const recommendations = await RecommendationService.getRecommendationsByType(
        userId,
        type,
        limit
      );

      res.status(200).json({
        success: true,
        data: recommendations,
        message: 'Recommendations retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getRecommendationsByType:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch recommendations',
        error: error.message
      });
    }
  },

  /**
   * POST /api/dashboard/recommendations/generate
   * Generate new recommendations
   */
  generateRecommendations: async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?.email;
      const userRole = req.user?.role;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const recommendations = await RecommendationService.generateRecommendations(
        userId,
        userRole
      );

      res.status(201).json({
        success: true,
        data: recommendations,
        message: 'Recommendations generated successfully'
      });
    } catch (error) {
      console.error('Error in generateRecommendations:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate recommendations',
        error: error.message
      });
    }
  },

  /**
   * POST /api/dashboard/recommendations/:id/dismiss
   * Dismiss recommendation
   */
  dismissRecommendation: async (req, res) => {
    try {
      const { id } = req.params;

      await RecommendationService.dismissRecommendation(id);

      res.status(200).json({
        success: true,
        message: 'Recommendation dismissed'
      });
    } catch (error) {
      console.error('Error in dismissRecommendation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to dismiss recommendation',
        error: error.message
      });
    }
  },

  /**
   * POST /api/dashboard/recommendations/cleanup
   * Clean up expired recommendations
   */
  cleanupExpiredRecommendations: async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?.email;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const deleted = await RecommendationService.cleanupExpiredRecommendations(userId);

      res.status(200).json({
        success: true,
        data: { deletedCount: deleted },
        message: `${deleted} expired recommendations deleted`
      });
    } catch (error) {
      console.error('Error in cleanupExpiredRecommendations:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cleanup expired recommendations',
        error: error.message
      });
    }
  }
};

module.exports = recommendationController;
