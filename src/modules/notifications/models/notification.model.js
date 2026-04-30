class Notification {
  constructor(data) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.title = data.title || '';
    this.message = data.message || '';
    this.read = data.read || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

module.exports = Notification;
