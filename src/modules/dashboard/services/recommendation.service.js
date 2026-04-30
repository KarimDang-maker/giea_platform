const RecommendationRepository = require('../repositories/recommendation.repository');
const { RecommendationModel } = require('../models');

/**
 * RecommendationService
 * Business logic for recommendation generation and management
 */
class RecommendationService {
  static instance = null;

  static getInstance() {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  /**
   * Generate personalized recommendations for user
   * Based on user's role, activity, and profile
   */
  async generateRecommendations(userId, userRole) {
    try {
      const recommendations = [];

      // Role-based recommendations
      if (userRole === 'student') {
        recommendations.push({
          userId,
          type: 'project',
          title: 'Explore Collaborative Projects',
          description: 'Join projects that match your skills and interests',
          reason: 'Based on your profile and recent activities',
          targetType: 'projects',
          relevanceScore: 85
        });

        recommendations.push({
          userId,
          type: 'resource',
          title: 'Learning Resources',
          description: 'Check out recommended courses and tutorials',
          reason: 'Recommended for skill development',
          targetType: 'resources',
          relevanceScore: 75
        });
      }

      if (userRole === 'entrepreneur') {
        recommendations.push({
          userId,
          type: 'connection',
          title: 'Connect with Investors',
          description: 'Find potential investors for your startup',
          reason: 'Growing entrepreneur network',
          targetType: 'investors',
          relevanceScore: 90
        });

        recommendations.push({
          userId,
          type: 'resource',
          title: 'Business Growth Tools',
          description: 'Access resources for startup growth',
          reason: 'Essential tools for entrepreneurs',
          targetType: 'resources',
          relevanceScore: 80
        });
      }

      if (userRole === 'investor') {
        recommendations.push({
          userId,
          type: 'project',
          title: 'Investment Opportunities',
          description: 'Review promising startup projects',
          reason: 'New projects matching your investment criteria',
          targetType: 'projects',
          relevanceScore: 88
        });
      }

      if (userRole === 'company') {
        recommendations.push({
          userId,
          type: 'talent',
          title: 'Find Top Talent',
          description: 'Search for professionals for your roles',
          reason: 'Talent pool recommendations',
          targetType: 'users',
          relevanceScore: 85
        });
      }

      // Generic recommendations
      recommendations.push({
        userId,
        type: 'community',
        title: 'Join Community Events',
        description: 'Participate in webinars and networking events',
        reason: 'Expand your network',
        targetType: 'events',
        relevanceScore: 70
      });

      // Bulk create recommendations
      const created = await RecommendationRepository.bulkCreate(userId, recommendations);
      return created;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Get active recommendations for user
   */
  async getActiveRecommendations(userId, limit = 5) {
    try {
      const recommendations = await RecommendationRepository.getActiveRecommendations(
        userId,
        limit
      );
      return recommendations;
    } catch (error) {
      console.error('Error fetching active recommendations:', error);
      throw error;
    }
  }

  /**
   * Get recommendations by type
   */
  async getRecommendationsByType(userId, type, limit = 10) {
    try {
      const recommendations = await RecommendationRepository.getRecommendationsByType(
        userId,
        type,
        limit
      );
      return recommendations;
    } catch (error) {
      console.error('Error fetching recommendations by type:', error);
      throw error;
    }
  }

  /**
   * Dismiss recommendation
   */
  async dismissRecommendation(recommendationId) {
    try {
      await RecommendationRepository.dismiss(recommendationId);
      return true;
    } catch (error) {
      console.error('Error dismissing recommendation:', error);
      throw error;
    }
  }

  /**
   * Clean up expired recommendations
   */
  async cleanupExpiredRecommendations(userId) {
    try {
      const deleted = await RecommendationRepository.deleteExpiredRecommendations(userId);
      return deleted;
    } catch (error) {
      console.error('Error cleaning up expired recommendations:', error);
      throw error;
    }
  }
}

module.exports = RecommendationService.getInstance();
