const admin = require('firebase-admin');
const StatisticsModel = require('../models/statistics.model');
const ReportModel = require('../models/report.model');

const STATISTICS_COLLECTION = 'statistics';
const REPORTS_COLLECTION = 'reports';

/**
 * StatisticsRepository - Handles all database operations for statistics
 * Separates data persistence from business logic
 */
class StatisticsRepository {
  /**
   * Get or create statistics for a specific period
   */
  async getStatistics(period = 'monthly') {
    try {
      const db = admin.firestore();
      const docId = `${period}_${new Date().toISOString().split('T')[0]}`;
      const statsRef = db.collection(STATISTICS_COLLECTION).doc(docId);
      const doc = await statsRef.get();

      if (!doc.exists) {
        return null;
      }

      return new StatisticsModel(doc.data());
    } catch (error) {
      throw new Error(`Error getting statistics: ${error.message}`);
    }
  }

  /**
   * Create or update statistics record
   */
  async saveStatistics(statistics) {
    try {
      const db = admin.firestore();
      const docId = `${statistics.period}_${new Date().toISOString().split('T')[0]}`;
      const statsRef = db.collection(STATISTICS_COLLECTION).doc(docId);

      const firestoreData = {
        ...statistics,
        updatedAt: new Date()
      };

      await statsRef.set(firestoreData, { merge: true });

      return new StatisticsModel(firestoreData);
    } catch (error) {
      throw new Error(`Error saving statistics: ${error.message}`);
    }
  }

  /**
   * Get statistics for a date range
   */
  async getStatisticsByDateRange(startDate, endDate) {
    try {
      const db = admin.firestore();
      const snapshot = await db
        .collection(STATISTICS_COLLECTION)
        .where('generatedAt', '>=', startDate)
        .where('generatedAt', '<=', endDate)
        .orderBy('generatedAt', 'desc')
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => new StatisticsModel(doc.data()));
    } catch (error) {
      throw new Error(`Error getting statistics by date range: ${error.message}`);
    }
  }

  /**
   * Get latest statistics
   */
  async getLatestStatistics() {
    try {
      const db = admin.firestore();
      const snapshot = await db
        .collection(STATISTICS_COLLECTION)
        .orderBy('generatedAt', 'desc')
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      return new StatisticsModel(snapshot.docs[0].data());
    } catch (error) {
      throw new Error(`Error getting latest statistics: ${error.message}`);
    }
  }

  /**
   * Delete old statistics (for cleanup)
   */
  async deleteOldStatistics(days = 90) {
    try {
      const db = admin.firestore();
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const snapshot = await db
        .collection(STATISTICS_COLLECTION)
        .where('generatedAt', '<', cutoffDate)
        .get();

      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      return snapshot.docs.length;
    } catch (error) {
      throw new Error(`Error deleting old statistics: ${error.message}`);
    }
  }
}

module.exports = new StatisticsRepository();
