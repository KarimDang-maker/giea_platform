/**
 * Recommendation Model
 * Represents a personalized recommendation for a user
 */
class RecommendationModel {
  constructor() {
    this.id = null;
    this.userId = null;
    this.type = null; // project, resource, skill, connection, category, etc.
    this.title = null;
    this.description = null;
    this.reason = null; // Why this recommendation is shown
    this.targetId = null; // ID of the recommended entity
    this.targetType = null; // Type of entity being recommended
    this.relevanceScore = 0; // 0-100 score indicating relevance
    this.metadata = {}; // Additional data about the recommendation
    this.isDismissed = false;
    this.createdAt = new Date();
    this.expiresAt = null; // When recommendation should expire
  }

  // Create a recommendation
  static create(data) {
    const recommendation = new RecommendationModel();
    recommendation.userId = data.userId;
    recommendation.type = data.type;
    recommendation.title = data.title;
    recommendation.description = data.description;
    recommendation.reason = data.reason;
    recommendation.targetId = data.targetId;
    recommendation.targetType = data.targetType;
    recommendation.relevanceScore = data.relevanceScore || 0;
    recommendation.metadata = data.metadata || {};
    recommendation.expiresAt = data.expiresAt;
    return recommendation;
  }

  // Dismiss recommendation
  dismiss() {
    this.isDismissed = true;
  }

  // Check if recommendation is still valid
  isValid() {
    if (this.isDismissed) return false;
    if (this.expiresAt && new Date() > this.expiresAt) return false;
    return true;
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      title: this.title,
      description: this.description,
      reason: this.reason,
      targetId: this.targetId,
      targetType: this.targetType,
      relevanceScore: this.relevanceScore,
      metadata: this.metadata,
      isValid: this.isValid(),
      isRejected: this.isRejected,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt
    };
  }
}

module.exports = RecommendationModel;
