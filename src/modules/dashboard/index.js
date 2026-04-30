const {
  dashboardRoutes,
  activityRoutes,
  recommendationRoutes
} = require('./routes');
const {
  dashboardController,
  activityController,
  recommendationController
} = require('./controllers');
const {
  DashboardService,
  ActivityService,
  RecommendationService
} = require('./services');
const {
  DashboardModel,
  ActivityModel,
  RecommendationModel
} = require('./models');
const {
  ActivityRepository,
  RecommendationRepository,
  DashboardRepository
} = require('./repositories');

module.exports = {
  routes: {
    dashboardRoutes,
    activityRoutes,
    recommendationRoutes
  },
  controllers: {
    dashboardController,
    activityController,
    recommendationController
  },
  services: {
    DashboardService,
    ActivityService,
    RecommendationService
  },
  models: {
    DashboardModel,
    ActivityModel,
    RecommendationModel
  },
  repositories: {
    ActivityRepository,
    RecommendationRepository,
    DashboardRepository
  }
};
