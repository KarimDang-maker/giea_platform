const admin = require('firebase-admin');
const statisticsRepository = require('../repositories/statistics.repository');
const { StatisticsModel } = require('../models');

/**
 * StatisticsService - Handles business logic for statistics generation and analysis
 * Orchestrates: StatisticsRepository + Firestore queries
 */
class StatisticsService {
  /**
   * Generate user statistics
   */
  async generateUserStatistics() {
    try {
      const db = admin.firestore();

      // Total users
      const usersSnapshot = await db.collection('users').get();
      const totalUsers = usersSnapshot.size;

      // Users by role
      const usersByRole = {
        student: 0,
        entrepreneur: 0,
        company: 0,
        investor: 0,
        mentor: 0,
        admin: 0
      };

      usersSnapshot.docs.forEach(doc => {
        const user = doc.data();
        if (user.role && usersByRole.hasOwnProperty(user.role)) {
          usersByRole[user.role]++;
        }
      });

      // Verified vs unverified
      let verifiedUsers = 0;
      usersSnapshot.docs.forEach(doc => {
        if (doc.data().isVerified) verifiedUsers++;
      });
      const unverifiedUsers = totalUsers - verifiedUsers;

      // Active users (logged in this month)
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      let activeUsers = 0;
      usersSnapshot.docs.forEach(doc => {
        const lastLogin = doc.data().lastLogin;
        if (lastLogin && new Date(lastLogin) > monthAgo) {
          activeUsers++;
        }
      });

      // New users this month
      const newUsersSnapshot = await db
        .collection('users')
        .where('createdAt', '>=', monthAgo)
        .get();
      const newUsersThisMonth = newUsersSnapshot.size;

      return {
        totalUsers,
        activeUsers,
        usersByRole,
        newUsersThisMonth,
        verifiedUsers,
        unverifiedUsers
      };
    } catch (error) {
      throw new Error(`Error generating user statistics: ${error.message}`);
    }
  }

  /**
   * Generate project statistics
   */
  async generateProjectStatistics() {
    try {
      const db = admin.firestore();

      // Total projects
      const projectsSnapshot = await db.collection('projets').get();
      const totalProjects = projectsSnapshot.size;

      // Projects by status
      const projectsByStatus = {
        soumis: 0,
        en_evaluation: 0,
        en_revision: 0,
        bancable: 0,
        rejete: 0,
        archivé: 0
      };

      // Projects by funding type
      const projectsByFunding = {
        subvention: 0,
        investissement: 0,
        mixte: 0
      };

      // Projects by maturity
      const projectsByMaturity = {
        idée: 0,
        prototype: 0,
        productif: 0
      };

      let totalFundingRequested = 0;
      let fundingCount = 0;

      projectsSnapshot.docs.forEach(doc => {
        const project = doc.data();

        if (project.statut && projectsByStatus.hasOwnProperty(project.statut)) {
          projectsByStatus[project.statut]++;
        }

        if (project.financement && projectsByFunding.hasOwnProperty(project.financement)) {
          projectsByFunding[project.financement]++;
        }

        if (project.niveauMaturite && projectsByMaturity.hasOwnProperty(project.niveauMaturite)) {
          projectsByMaturity[project.niveauMaturite]++;
        }

        if (project.montantRecherche) {
          totalFundingRequested += project.montantRecherche;
          fundingCount++;
        }
      });

      const averageFundingPerProject = fundingCount > 0 ? totalFundingRequested / fundingCount : 0;

      return {
        totalProjects,
        projectsByStatus,
        projectsByFunding,
        projectsByMaturity,
        totalFundingRequested,
        averageFundingPerProject
      };
    } catch (error) {
      throw new Error(`Error generating project statistics: ${error.message}`);
    }
  }

  /**
   * Generate activity statistics
   */
  async generateActivityStatistics() {
    try {
      const db = admin.firestore();

      // For now, we'll return placeholder data
      // In a production environment, you might have activity logs collection
      const activityStats = {
        totalLoginEvents: 0,
        loginEventsThisMonth: 0,
        averageSessionDuration: 0,
        platformActivityTrend: []
      };

      return activityStats;
    } catch (error) {
      throw new Error(`Error generating activity statistics: ${error.message}`);
    }
  }

  /**
   * Generate marketplace statistics
   */
  async generateMarketplaceStatistics() {
    try {
      const db = admin.firestore();

      // Total companies (company pages)
      const companiesSnapshot = await db.collection('companyPages').get();
      const totalCompanies = companiesSnapshot.size;

      // Total products
      const productsSnapshot = await db.collection('companyProducts').get();
      const totalProducts = productsSnapshot.size;

      // Total services
      const servicesSnapshot = await db.collection('companyServices').get();
      const totalServices = servicesSnapshot.size;

      // Total news
      const newsSnapshot = await db.collection('companyNews').get();
      const totalNews = newsSnapshot.size;

      return {
        totalCompanies,
        totalProducts,
        totalServices,
        totalNews
      };
    } catch (error) {
      throw new Error(`Error generating marketplace statistics: ${error.message}`);
    }
  }

  /**
   * Generate comprehensive platform statistics
   */
  async generateComprehensiveStatistics(period = 'monthly') {
    try {
      const userStats = await this.generateUserStatistics();
      const projectStats = await this.generateProjectStatistics();
      const activityStats = await this.generateActivityStatistics();
      const marketplaceStats = await this.generateMarketplaceStatistics();

      const statistics = new StatisticsModel({
        totalUsers: userStats.totalUsers,
        activeUsers: userStats.activeUsers,
        usersByRole: userStats.usersByRole,
        newUsersThisMonth: userStats.newUsersThisMonth,
        verifiedUsers: userStats.verifiedUsers,
        unverifiedUsers: userStats.unverifiedUsers,
        totalProjects: projectStats.totalProjects,
        projectsByStatus: projectStats.projectsByStatus,
        projectsByFunding: projectStats.projectsByFunding,
        projectsByMaturity: projectStats.projectsByMaturity,
        totalFundingRequested: projectStats.totalFundingRequested,
        averageFundingPerProject: projectStats.averageFundingPerProject,
        totalLoginEvents: activityStats.totalLoginEvents,
        loginEventsThisMonth: activityStats.loginEventsThisMonth,
        averageSessionDuration: activityStats.averageSessionDuration,
        platformActivityTrend: activityStats.platformActivityTrend,
        totalCompanies: marketplaceStats.totalCompanies,
        totalProducts: marketplaceStats.totalProducts,
        totalServices: marketplaceStats.totalServices,
        totalNews: marketplaceStats.totalNews,
        period
      });

      return await statisticsRepository.saveStatistics(statistics);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get statistics by period
   */
  async getStatistics(period = 'monthly') {
    try {
      const stats = await statisticsRepository.getStatistics(period);
      if (!stats) {
        // Generate if doesn't exist
        return await this.generateComprehensiveStatistics(period);
      }
      return stats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get latest statistics
   */
  async getLatestStatistics() {
    try {
      return await statisticsRepository.getLatestStatistics();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get statistics trends (multiple periods)
   */
  async getStatisticsTrends(startDate, endDate) {
    try {
      return await statisticsRepository.getStatisticsByDateRange(startDate, endDate);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new StatisticsService();
