/**
 * Activity Model
 * Represents a user activity in the dashboard
 */
class ActivityModel {
  constructor() {
    this.id = null;
    this.userId = null;
    this.type = null; // project_created, project_updated, comment_added, resource_uploaded, message_received, etc.
    this.title = null;
    this.description = null;
    this.entityType = null; // project, resource, comment, message, profile, etc.
    this.entityId = null; // ID of the related entity
    this.actionBy = null; // User who performed the action (can be the user themselves)
    this.actionByName = null;
    this.relatedData = {}; // Additional context data
    this.timestamp = new Date();
    this.isRead = false;
    this.metadata = {}; // Additional metadata
  }

  // Create an activity
  static create(data) {
    const activity = new ActivityModel();
    activity.userId = data.userId;
    activity.type = data.type;
    activity.title = data.title;
    activity.description = data.description;
    activity.entityType = data.entityType;
    activity.entityId = data.entityId;
    activity.actionBy = data.actionBy;
    activity.actionByName = data.actionByName;
    activity.relatedData = data.relatedData || {};
    activity.metadata = data.metadata || {};
    return activity;
  }

  // Mark as read
  markAsRead() {
    this.isRead = true;
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      title: this.title,
      description: this.description,
      entityType: this.entityType,
      entityId: this.entityId,
      actionBy: this.actionBy,
      actionByName: this.actionByName,
      relatedData: this.relatedData,
      timestamp: this.timestamp,
      isRead: this.isRead,
      metadata: this.metadata
    };
  }
}

module.exports = ActivityModel;
