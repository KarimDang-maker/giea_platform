const reportRepository = require('../repositories/report.repository');
const { ReportModel } = require('../models');

/**
 * ReportService - Handles business logic for report generation and management
 * Orchestrates: ReportRepository + Report creation logic
 */
class ReportService {
  /**
   * Create activity report
   */
  async createActivityReport(data, adminEmail) {
    try {
      const report = new ReportModel({
        title: data.title || 'Activity Report',
        description: data.description || 'Platform activity analysis',
        reportType: 'activity',
        scope: data.scope || 'platform',
        filters: data.filters || {},
        periodStart: data.periodStart || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        periodEnd: data.periodEnd || new Date(),
        summary: data.summary || '',
        metrics: data.metrics || {},
        insights: data.insights || [],
        generatedBy: adminEmail,
        format: data.format || 'json'
      });

      return await reportRepository.create(report);
    } catch (error) {
      throw new Error(`Error creating activity report: ${error.message}`);
    }
  }

  /**
   * Create analytics report
   */
  async createAnalyticsReport(data, adminEmail) {
    try {
      const report = new ReportModel({
        title: data.title || 'Analytics Report',
        description: data.description || 'Detailed platform analytics',
        reportType: 'analytics',
        scope: data.scope || 'platform',
        filters: data.filters || {},
        periodStart: data.periodStart || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        periodEnd: data.periodEnd || new Date(),
        summary: data.summary || '',
        metrics: data.metrics || {},
        insights: data.insights || [],
        charts: data.charts || [],
        generatedBy: adminEmail,
        format: data.format || 'json'
      });

      return await reportRepository.create(report);
    } catch (error) {
      throw new Error(`Error creating analytics report: ${error.message}`);
    }
  }

  /**
   * Get report by ID
   */
  async getReportById(reportId) {
    try {
      const report = await reportRepository.findById(reportId);
      if (!report) {
        throw new Error('Report not found');
      }
      return report;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all reports with optional filters
   */
  async getAllReports(filters = {}) {
    try {
      return await reportRepository.findAll(filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get reports by type
   */
  async getReportsByType(reportType) {
    try {
      return await reportRepository.findByType(reportType);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update report
   */
  async updateReport(reportId, updateData) {
    try {
      return await reportRepository.update(reportId, updateData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete report
   */
  async deleteReport(reportId) {
    try {
      return await reportRepository.delete(reportId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Schedule report for distribution
   */
  async scheduleReportDistribution(reportId, recipients, frequency = 'weekly') {
    try {
      const updateData = {
        isScheduled: true,
        status: 'scheduled',
        recipients: recipients,
        frequency: frequency
      };
      return await reportRepository.update(reportId, updateData);
    } catch (error) {
      throw new Error(`Error scheduling report: ${error.message}`);
    }
  }

  /**
   * Unschedule report
   */
  async unscheduleReport(reportId) {
    try {
      const updateData = {
        isScheduled: false,
        status: 'generated'
      };
      return await reportRepository.update(reportId, updateData);
    } catch (error) {
      throw new Error(`Error unscheduling report: ${error.message}`);
    }
  }

  /**
   * Export report (placeholder - actual export logic depends on format)
   */
  async exportReport(reportId, format = 'json') {
    try {
      const report = await this.getReportById(reportId);

      if (!report.isExportable) {
        throw new Error('This report cannot be exported');
      }

      // Export logic would depend on format (json, csv, pdf)
      // This is a placeholder
      return {
        success: true,
        message: `Report exported as ${format}`,
        data: report.toJSON()
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get scheduled reports
   */
  async getScheduledReports() {
    try {
      return await reportRepository.getScheduledReports();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Archive old reports
   */
  async archiveOldReports(days = 180) {
    try {
      const count = await reportRepository.archiveOldReports(days);
      return {
        success: true,
        message: `${count} reports archived`
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ReportService();
