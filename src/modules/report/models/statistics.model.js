/**
 * Statistics Model - Data only (no database operations)
 * Purpose: Represent statistics data
 * Database operations are handled by StatisticsRepository
 */

class StatisticsModel {
  constructor(data = {}) {
    // User Statistics
    this.totalUsers = data.totalUsers || 0;
    this.activeUsers = data.activeUsers || 0;
    this.usersByRole = data.usersByRole || {
      student: 0,
      entrepreneur: 0,
      company: 0,
      investor: 0,
      mentor: 0,
      admin: 0
    };
    this.newUsersThisMonth = data.newUsersThisMonth || 0;
    this.verifiedUsers = data.verifiedUsers || 0;
    this.unverifiedUsers = data.unverifiedUsers || 0;

    // Project Statistics
    this.totalProjects = data.totalProjects || 0;
    this.projectsByStatus = data.projectsByStatus || {
      soumis: 0,
      en_evaluation: 0,
      en_revision: 0,
      bancable: 0,
      rejete: 0,
      archivé: 0
    };
    this.projectsByFunding = data.projectsByFunding || {
      subvention: 0,
      investissement: 0,
      mixte: 0
    };
    this.projectsByMaturity = data.projectsByMaturity || {
      idée: 0,
      prototype: 0,
      productif: 0
    };
    this.totalFundingRequested = data.totalFundingRequested || 0;
    this.averageFundingPerProject = data.averageFundingPerProject || 0;

    // Activity Statistics
    this.totalLoginEvents = data.totalLoginEvents || 0;
    this.loginEventsThisMonth = data.loginEventsThisMonth || 0;
    this.averageSessionDuration = data.averageSessionDuration || 0; // in minutes
    this.platformActivityTrend = data.platformActivityTrend || []; // time-series data

    // Marketplace Statistics
    this.totalCompanies = data.totalCompanies || 0;
    this.totalProducts = data.totalProducts || 0;
    this.totalServices = data.totalServices || 0;
    this.totalNews = data.totalNews || 0;

    // Timestamps
    this.generatedAt = data.generatedAt || new Date();
    this.period = data.period || 'monthly'; // daily, weekly, monthly, yearly
    this.periodStart = data.periodStart || null;
    this.periodEnd = data.periodEnd || null;
  }

  /**
   * Format statistics for response
   */
  toJSON() {
    return {
      userStatistics: {
        totalUsers: this.totalUsers,
        activeUsers: this.activeUsers,
        usersByRole: this.usersByRole,
        newUsersThisMonth: this.newUsersThisMonth,
        verifiedUsers: this.verifiedUsers,
        unverifiedUsers: this.unverifiedUsers
      },
      projectStatistics: {
        totalProjects: this.totalProjects,
        projectsByStatus: this.projectsByStatus,
        projectsByFunding: this.projectsByFunding,
        projectsByMaturity: this.projectsByMaturity,
        totalFundingRequested: this.totalFundingRequested,
        averageFundingPerProject: this.averageFundingPerProject
      },
      activityStatistics: {
        totalLoginEvents: this.totalLoginEvents,
        loginEventsThisMonth: this.loginEventsThisMonth,
        averageSessionDuration: this.averageSessionDuration,
        platformActivityTrend: this.platformActivityTrend
      },
      marketplaceStatistics: {
        totalCompanies: this.totalCompanies,
        totalProducts: this.totalProducts,
        totalServices: this.totalServices,
        totalNews: this.totalNews
      },
      generatedAt: this.generatedAt,
      period: this.period,
      periodStart: this.periodStart,
      periodEnd: this.periodEnd
    };
  }
}

module.exports = StatisticsModel;
