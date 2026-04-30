const { getFirestore } = require('firebase-admin/firestore');

class NotificationRepository {
  constructor() {
    this.collection = 'notifications';
  }

  getDb() {
    return getFirestore();
  }

  async create(data) {
    const docRef = await this.getDb().collection(this.collection).add(data);
    return { id: docRef.id, ...data };
  }

  async findAllByUserId(userId) {
    const snapshot = await this.getDb().collection(this.collection).where('userId', '==', userId).get();
    if (snapshot.empty) return [];
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findById(id) {
    const doc = await this.getDb().collection(this.collection).doc(id).get();
    if (!doc.exists) return null;
    
    return { id: doc.id, ...doc.data() };
  }

  async update(id, data) {
    await this.getDb().collection(this.collection).doc(id).update({
      ...data,
      updatedAt: new Date()
    });
    return this.findById(id);
  }

  async delete(id) {
    await this.getDb().collection(this.collection).doc(id).delete();
    return true;
  }
}

module.exports = new NotificationRepository();
