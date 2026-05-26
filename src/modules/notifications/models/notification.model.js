class NotificationEvent {
  constructor({ type, targets, data, category = "application" }) {
    this.id = crypto.randomUUID(); // Identifiant unique pour le tracking/logs
    this.type = type; // EX: 'USER_REGISTERED', 'PROFILE_INCOMPLETE'
    this.category = "email" | "application" // define if the notification is for email or application
    this.targets = Array.isArray(targets) ? targets : [targets]; // Toujours une liste
    this.data = data; // Les variables brutes (ex: { firstName: 'John' })
    this.timestamp = Date.now();
  }
}

const NotificationType = Object.freeze({
    COMPLETE_PROFILE :   "COMPLETE_PROFILE",
    // companie new:
    COMPANIE_NEWS_ADD: "COMPANIE_NEWS_ADD",
    COMPANIE_PRODUCT_ADD : "COMPANIE_PRODUCT_ADD",
    COMPANIE_SERVICE_ADD : "COMPANIE_SERVICE_ADD",
    // GESTION DE PROJETS:
    PROJECT_NEW : "PROJECT_NEW",
    PROJECT_UPDATE : "PROJECT_UPDATE",
    PROJECT_MEMBERS_ADD : "PROJECT_MEMBERS_ADD",
    PROJECT_DOCC_ADD : "PROJECT_DOCC_ADD",
    PLATFORM_EVENT_CREATED: "PLATFORM_EVENT_CREATED",
})


class Notifications {
  constructor(data) {
    this.id = crypto.randomUUID();
    this.userId = data.userId || null;
    this.title = data.title || '';  
    this.message = data.message || '';
    this.read = data.read || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

module.exports = {Notifications, NotificationEvent, NotificationType};
