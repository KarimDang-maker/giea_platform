const statisticsService = require('../services/statistics.service');
const { validationResult } = require('express-validator');

/**
 * StatisticsController - Only handles HTTP request/response
 * All business logic is delegated to StatisticsService
 */

exports.getLatestStatistics = async (req, res) => {
  try {
    const stats = await statisticsService.getLatestStatistics();

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'No statistics available yet'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Latest statistics retrieved successfully',
      data: stats.toJSON()
    });
  } catch (error) {
    console.error('Error getting latest statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving statistics'
    });
  }
};

exports.getStatisticsByPeriod = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;

    const stats = await statisticsService.getStatistics(period);

    res.status(200).json({
      success: true,
      message: `Statistics for period "${period}" retrieved successfully`,
      data: stats.toJSON()
    });
  } catch (error) {
    console.error('Error getting statistics by period:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving statistics'
    });
  }
};

exports.getStatisticsTrends = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate are required'
      });
    }

    const trends = await statisticsService.getStatisticsTrends(
      new Date(startDate),
      new Date(endDate)
    );

    res.status(200).json({
      success: true,
      message: 'Statistics trends retrieved successfully',
      data: trends.map(stat => stat.toJSON())
    });
  } catch (error) {
    console.error('Error getting statistics trends:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving statistics'
    });
  }
};

exports.generateStatistics = async (req, res) => {
  try {
    const { period = 'monthly' } = req.body;

    const stats = await statisticsService.generateComprehensiveStatistics(period);

    res.status(201).json({
      success: true,
      message: 'Statistics generated successfully',
      data: stats.toJSON()
    });
  } catch (error) {
    console.error('Error generating statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating statistics'
    });
  }
};

exports.getUserStatistics = async (req, res) => {
  try {
    const stats = await statisticsService.generateUserStatistics();

    res.status(200).json({
      success: true,
      message: 'User statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Error getting user statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving user statistics'
    });
  }
};

exports.getProjectStatistics = async (req, res) => {
  try {
    const stats = await statisticsService.generateProjectStatistics();

    res.status(200).json({
      success: true,
      message: 'Project statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Error getting project statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving project statistics'
    });
  }
};

exports.getMarketplaceStatistics = async (req, res) => {
  try {
    const stats = await statisticsService.generateMarketplaceStatistics();

    res.status(200).json({
      success: true,
      message: 'Marketplace statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Error getting marketplace statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving marketplace statistics'
    });
  }
};
