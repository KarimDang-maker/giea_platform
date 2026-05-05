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
   * Uses in-memory filtering to avoid composite index requirement
   */
  async getActiveRecommendations(userId, limit = 5) {
    try {
      const db = admin.firestore();
      
      // Fetch all recommendations for user without filters
      const snapshot = await db
        .collection('recommendations')
        .where('userId', '==', userId)
        .get();

      const recommendations = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        recommendations.push(data);
      });
      
      // Filter in-memory: not dismissed and not expired
      const filtered = recommendations.filter(rec => {
        if (rec.isDismissed === true) return false;
        if (rec.expiresAt) {
          const expiresAt = rec.expiresAt instanceof admin.firestore.Timestamp 
            ? rec.expiresAt.toDate() 
            : new Date(rec.expiresAt);
          if (expiresAt <= new Date()) return false;
        }
        return true;
      });
      
      // Sort by relevance score descending
      filtered.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      
      return filtered.slice(0, limit);
    } catch (error) {
      console.error('Error fetching active recommendations:', error);
      throw error;
    }
  }

  /**
   * Get recommendations by type
   * Uses in-memory filtering to avoid composite index requirement
   */
  async getRecommendationsByType(userId, type, limit = 10) {
    try {
      const db = admin.firestore();
      
      // Fetch all recommendations for user without type filter
      const snapshot = await db
        .collection('recommendations')
        .where('userId', '==', userId)
        .get();

      const recommendations = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        recommendations.push(data);
      });
      
      // Filter in-memory: by type and not dismissed
      const filtered = recommendations.filter(rec => 
        rec.type === type && rec.isDismissed !== true
      );
      
      // Sort by relevance score descending
      filtered.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      
      return filtered.slice(0, limit);
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
   * Uses in-memory filtering to avoid composite index requirement
   */
  async deleteExpiredRecommendations(userId) {
    try {
      const db = admin.firestore();
      
      // Fetch all recommendations for user
      const snapshot = await db
        .collection('recommendations')
        .where('userId', '==', userId)
        .get();

      const now = new Date();
      const batch = db.batch();
      let deletedCount = 0;
      
      // Filter in-memory and delete expired ones
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.expiresAt) {
          const expiresAt = data.expiresAt instanceof admin.firestore.Timestamp 
            ? data.expiresAt.toDate() 
            : new Date(data.expiresAt);
          if (expiresAt < now) {
            batch.delete(doc.ref);
            deletedCount++;
          }
        }
      });
      
      await batch.commit();
      return deletedCount;
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
