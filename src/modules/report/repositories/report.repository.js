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
   * Uses in-memory filtering to avoid composite index requirement
   */
  async findAll(filters = {}) {
    try {
      const db = admin.firestore();
      
      // Fetch all reports without filters
      const snapshot = await db
        .collection(REPORTS_COLLECTION)
        .orderBy('generatedAt', 'desc')
        .get();

      if (snapshot.empty) {
        return [];
      }

      // Apply filters in-memory
      let reports = snapshot.docs.map(doc => new ReportModel(doc.data()));

      if (filters.status) {
        reports = reports.filter(report => report.status === filters.status);
      }

      if (filters.reportType) {
        reports = reports.filter(report => report.reportType === filters.reportType);
      }

      if (filters.scope) {
        reports = reports.filter(report => report.scope === filters.scope);
      }

      return reports;
    } catch (error) {
      throw new Error(`Error getting all reports: ${error.message}`);
    }
  }

  /**
   * Get reports by type
   * Uses in-memory filtering to avoid index requirement
   */
  async findByType(reportType) {
    try {
      const db = admin.firestore();
      const snapshot = await db
        .collection(REPORTS_COLLECTION)
        .orderBy('generatedAt', 'desc')
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs
        .map(doc => new ReportModel(doc.data()))
        .filter(report => report.reportType === reportType);
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
   * Uses in-memory filtering to avoid composite index requirement
   */
  async getScheduledReports() {
    try {
      const db = admin.firestore();
      const snapshot = await db
        .collection(REPORTS_COLLECTION)
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs
        .map(doc => new ReportModel(doc.data()))
        .filter(report => report.isScheduled === true && report.status === 'scheduled');
    } catch (error) {
      throw new Error(`Error getting scheduled reports: ${error.message}`);
    }
  }

  /**
   * Archive old reports
   * Uses in-memory filtering to avoid composite index requirement
   */
  async archiveOldReports(days = 180) {
    try {
      const db = admin.firestore();
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      // Fetch all reports
      const snapshot = await db
        .collection(REPORTS_COLLECTION)
        .get();

      // Filter in-memory for reports older than cutoffDate with status 'generated'
      const reportsToArchive = snapshot.docs.filter(doc => {
        const data = doc.data();
        const reportDate = data.generatedAt instanceof admin.firestore.Timestamp 
          ? data.generatedAt.toDate() 
          : new Date(data.generatedAt);
        return reportDate < cutoffDate && data.status === 'generated';
      });

      // Archive in batch
      const batch = db.batch();
      reportsToArchive.forEach(doc => {
        batch.update(doc.ref, { status: 'archived', updatedAt: new Date() });
      });

      await batch.commit();
      return reportsToArchive.length;
    } catch (error) {
      throw new Error(`Error archiving old reports: ${error.message}`);
    }
  }
}

module.exports = new ReportRepository();
