const admin = require('firebase-admin');
const ReportModel = require('../models/report.model');

const REPORTS_COLLECTION = 'reports';

/**
 * ReportRepository - Handles all database operations for reports
 * Separates data persistence from business logic
 */
class ReportRepository {
  /**
   * Create a new report
   */
  async create(reportData) {
    try {
      const report = new ReportModel(reportData);
      report.id = report.id || `report_${Date.now()}`;

      const db = admin.firestore();
      const reportRef = db.collection(REPORTS_COLLECTION).doc(report.id);

      const firestoreData = report.toJSON();
      await reportRef.set(firestoreData, { merge: true });

      return report;
    } catch (error) {
      throw new Error(`Error creating report: ${error.message}`);
    }
  }

  /**
   * Find report by ID
   */
  async findById(id) {
    try {
      const db = admin.firestore();
      const reportRef = db.collection(REPORTS_COLLECTION).doc(id);
      const doc = await reportRef.get();

      if (!doc.exists) {
        return null;
      }

      return new ReportModel(doc.data());
    } catch (error) {
      throw new Error(`Error finding report: ${error.message}`);
    }
  }

  /**
   * Get all reports (optionally filtered by status, type, or scope)
   */
  async findAll(filters = {}) {
    try {
      const db = admin.firestore();
      let query = db.collection(REPORTS_COLLECTION);

      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      if (filters.reportType) {
        query = query.where('reportType', '==', filters.reportType);
      }

      if (filters.scope) {
        query = query.where('scope', '==', filters.scope);
      }

      query = query.orderBy('generatedAt', 'desc');

      const snapshot = await query.get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => new ReportModel(doc.data()));
    } catch (error) {
      throw new Error(`Error getting all reports: ${error.message}`);
    }
  }

  /**
   * Get reports by type
   */
  async findByType(reportType) {
    try {
      const db = admin.firestore();
      const snapshot = await db
        .collection(REPORTS_COLLECTION)
        .where('reportType', '==', reportType)
        .orderBy('generatedAt', 'desc')
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => new ReportModel(doc.data()));
    } catch (error) {
      throw new Error(`Error getting reports by type: ${error.message}`);
    }
  }

  /**
   * Update a report
   */
  async update(id, updateData) {
    try {
      const db = admin.firestore();
      const reportRef = db.collection(REPORTS_COLLECTION).doc(id);

      const updates = {
        ...updateData,
        lastModifiedAt: new Date(),
        updatedAt: new Date()
      };

      await reportRef.update(updates);

      return this.findById(id);
    } catch (error) {
      throw new Error(`Error updating report: ${error.message}`);
    }
  }

  /**
   * Delete a report
   */
  async delete(id) {
    try {
      const db = admin.firestore();
      const reportRef = db.collection(REPORTS_COLLECTION).doc(id);
      await reportRef.delete();
      return { success: true, message: 'Report deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting report: ${error.message}`);
    }
  }

  /**
   * Get scheduled reports for distribution
   */
  async getScheduledReports() {
    try {
      const db = admin.firestore();
      const snapshot = await db
        .collection(REPORTS_COLLECTION)
        .where('isScheduled', '==', true)
        .where('status', '==', 'scheduled')
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => new ReportModel(doc.data()));
    } catch (error) {
      throw new Error(`Error getting scheduled reports: ${error.message}`);
    }
  }

  /**
   * Archive old reports
   */
  async archiveOldReports(days = 180) {
    try {
      const db = admin.firestore();
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const snapshot = await db
        .collection(REPORTS_COLLECTION)
        .where('generatedAt', '<', cutoffDate)
        .where('status', '==', 'generated')
        .get();

      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { status: 'archived' });
      });

      await batch.commit();
      return snapshot.docs.length;
    } catch (error) {
      throw new Error(`Error archiving old reports: ${error.message}`);
    }
  }
}

module.exports = new ReportRepository();
