/**
 * Report Model - Data only (no database operations)
 * Purpose: Represent activity/analytics report data
 * Database operations are handled by ReportRepository
 */

class ReportModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.reportType = data.reportType || 'activity'; // activity, analytics, custom
    
    // Report scope
    this.scope = data.scope || 'platform'; // platform, users, projects, marketplace
    this.filters = data.filters || {}; // Custom filters applied

    // Time period
    this.periodStart = data.periodStart || new Date(new Date().setDate(new Date().getDate() - 30));
    this.periodEnd = data.periodEnd || new Date();
    this.frequency = data.frequency || 'manual'; // manual, daily, weekly, monthly

    // Report content
    this.summary = data.summary || '';
    this.metrics = data.metrics || {};
    this.charts = data.charts || []; // References to chart data
    this.insights = data.insights || []; // Key findings and observations
    
    // Report status
    this.status = data.status || 'generated'; // generated, scheduled, archived
    this.format = data.format || 'json'; // json, csv, pdf
    
    // Metadata
    this.generatedBy = data.generatedBy || ''; // Admin email
    this.generatedAt = data.generatedAt || new Date();
    this.lastModifiedAt = data.lastModifiedAt || new Date();
    
    // Export & Distribution
    this.isExportable = data.isExportable !== false ? true : false;
    this.isScheduled = data.isScheduled || false;
    this.recipients = data.recipients || []; // Emails for scheduled distribution
    
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Format report for response
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      reportType: this.reportType,
      scope: this.scope,
      filters: this.filters,
      periodStart: this.periodStart,
      periodEnd: this.periodEnd,
      frequency: this.frequency,
      summary: this.summary,
      metrics: this.metrics,
      charts: this.charts,
      insights: this.insights,
      status: this.status,
      format: this.format,
      generatedBy: this.generatedBy,
      generatedAt: this.generatedAt,
      lastModifiedAt: this.lastModifiedAt,
      isExportable: this.isExportable,
      isScheduled: this.isScheduled,
      recipients: this.recipients,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = ReportModel;
