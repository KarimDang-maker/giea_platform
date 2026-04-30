const admin = require('firebase-admin');
const RecommendationModel = require('../models/recommendation.model');

/**
 * RecommendationRepository
 * Handles all recommendation-related database operations
 */
class RecommendationRepository {
  static instance = null;

  // Singleton pattern
  static getInstance() {
    if (!RecommendationRepository.instance) {
      RecommendationRepository.instance = new RecommendationRepository();
    }
    return RecommendationRepository.instance;
  }

  /**
   * Create recommendation
   */
  async create(recommendationData) {
    try {
      const db = admin.firestore();
      const recommendation = RecommendationModel.create(recommendationData);
      const docRef = await db.collection('recommendations').add(recommendation.toJSON());
      recommendation.id = docRef.id;
      return recommendation;
    } catch (error) {
      console.error('Error creating recommendation:', error);
      throw error;
    }
  }

  /**
   * Get active recommendations for user
   */
  async getActiveRecommendations(userId, limit = 5) {
    try {
      const db = admin.firestore();
      const snapshot = await db
        .collection('recommendations')
        .where('userId', '==', userId)
        .where('isDismissed', '==', false)
        .limit(limit * 3)
        .get();

      const recommendations = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        // Filter expired recommendations
        if (!data.expiresAt || new Date(data.expiresAt) > new Date()) {
          recommendations.push(data);
        }
      });
      
      // Sort by relevance score descending in application code
      recommendations.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      
      return recommendations.slice(0, limit);
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
      const db = admin.firestore();
      const snapshot = await db
        .collection('recommendations')
        .where('userId', '==', userId)
        .where('type', '==', type)
        .where('isDismissed', '==', false)
        .limit(limit * 3)
        .get();

      const recommendations = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        recommendations.push(data);
      });
      
      // Sort by relevance score descending in application code
      recommendations.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      
      return recommendations.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recommendations by type:', error);
      throw error;
    }
  }

  /**
   * Dismiss recommendation
   */
  async dismiss(recommendationId) {
    try {
      const db = admin.firestore();
      await db.collection('recommendations').doc(recommendationId).update({
        isDismissed: true
      });
      return true;
    } catch (error) {
      console.error('Error dismissing recommendation:', error);
      throw error;
    }
  }

  /**
   * Update recommendation score
   */
  async updateScore(recommendationId, score) {
    try {
      const db = admin.firestore();
      await db.collection('recommendations').doc(recommendationId).update({
        relevanceScore: score
      });
      return true;
    } catch (error) {
      console.error('Error updating recommendation score:', error);
      throw error;
    }
  }

  /**
   * Bulk create recommendations for user
   */
  async bulkCreate(userId, recommendationsData) {
    try {
      const db = admin.firestore();
      const batch = db.batch();
      const recommendations = [];

      for (const data of recommendationsData) {
        data.userId = userId;
        const recommendation = RecommendationModel.create(data);
        const docRef = db.collection('recommendations').doc();
        batch.set(docRef, recommendation.toJSON());
        recommendation.id = docRef.id;
        recommendations.push(recommendation);
      }

      await batch.commit();
      return recommendations;
    } catch (error) {
      console.error('Error bulk creating recommendations:', error);
      throw error;
    }
  }

  /**
   * Delete expired recommendations
   */
  async deleteExpiredRecommendations(userId) {
    try {
      const db = admin.firestore();
      const snapshot = await db
        .collection('recommendations')
        .where('userId', '==', userId)
        .where('expiresAt', '<', new Date())
        .get();

      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      return snapshot.size;
    } catch (error) {
      console.error('Error deleting expired recommendations:', error);
      throw error;
    }
  }

  /**
   * Get recommendation by ID
   */
  async findById(recommendationId) {
    try {
      const db = admin.firestore();
      const doc = await db.collection('recommendations').doc(recommendationId).get();
      if (!doc.exists) {
        return null;
      }
      const data = doc.data();
      data.id = doc.id;
      return data;
    } catch (error) {
      console.error('Error fetching recommendation by ID:', error);
      throw error;
    }
  }
}

module.exports = RecommendationRepository.getInstance();
