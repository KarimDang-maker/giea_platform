const reportService = require('../services/report.service');
const { validationResult } = require('express-validator');

/**
 * ReportController - Only handles HTTP request/response
 * All business logic is delegated to ReportService
 */

exports.createActivityReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const adminEmail = req.user.email;
    const report = await reportService.createActivityReport(req.body, adminEmail);

    res.status(201).json({
      success: true,
      message: 'Activity report created successfully',
      data: report.toJSON()
    });
  } catch (error) {
    console.error('Error creating activity report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating activity report'
    });
  }
};

exports.createAnalyticsReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const adminEmail = req.user.email;
    const report = await reportService.createAnalyticsReport(req.body, adminEmail);

    res.status(201).json({
      success: true,
      message: 'Analytics report created successfully',
      data: report.toJSON()
    });
  } catch (error) {
    console.error('Error creating analytics report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating analytics report'
    });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await reportService.getReportById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Report retrieved successfully',
      data: report.toJSON()
    });
  } catch (error) {
    console.error('Error getting report:', error);
    const statusCode = error.message === 'Report not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error retrieving report'
    });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      reportType: req.query.reportType,
      scope: req.query.scope
    };

    const reports = await reportService.getAllReports(filters);

    res.status(200).json({
      success: true,
      message: 'Reports retrieved successfully',
      data: reports.map(report => report.toJSON())
    });
  } catch (error) {
    console.error('Error getting all reports:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving reports'
    });
  }
};

exports.getReportsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const reports = await reportService.getReportsByType(type);

    res.status(200).json({
      success: true,
      message: `Reports of type "${type}" retrieved successfully`,
      data: reports.map(report => report.toJSON())
    });
  } catch (error) {
    console.error('Error getting reports by type:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving reports'
    });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const report = await reportService.updateReport(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      data: report.toJSON()
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating report'
    });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    await reportService.deleteReport(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting report'
    });
  }
};

exports.scheduleReportDistribution = async (req, res) => {
  try {
    const { recipients, frequency = 'weekly' } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Recipients array is required'
      });
    }

    const report = await reportService.scheduleReportDistribution(
      req.params.id,
      recipients,
      frequency
    );

    res.status(200).json({
      success: true,
      message: 'Report scheduled for distribution successfully',
      data: report.toJSON()
    });
  } catch (error) {
    console.error('Error scheduling report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error scheduling report'
    });
  }
};

exports.unscheduleReport = async (req, res) => {
  try {
    const report = await reportService.unscheduleReport(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Report unscheduled successfully',
      data: report.toJSON()
    });
  } catch (error) {
    console.error('Error unscheduling report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error unscheduling report'
    });
  }
};

exports.exportReport = async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const result = await reportService.exportReport(req.params.id, format);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error exporting report'
    });
  }
};

exports.archiveOldReports = async (req, res) => {
  try {
    const { days = 180 } = req.body;

    const result = await reportService.archiveOldReports(days);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Error archiving old reports:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error archiving reports'
    });
  }
};
