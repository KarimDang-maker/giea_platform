const { initializeFirestore } = require('../../../config/database');
const CategoryModel = require('../models/category.model');

class CategoryRepository {
  constructor() {
    this.db = initializeFirestore();
    this.collection = this.db.collection('categories');
  }

  async findAll() {
    const snapshot = await this.collection.where('status', '==', 'active').get();
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => new CategoryModel({ id: doc.id, ...doc.data() }));
  }

  async findByType(type) {
    const snapshot = await this.collection
      .where('type', '==', type)
      .where('status', '==', 'active')
      .get();
      
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => new CategoryModel({ id: doc.id, ...doc.data() }));
  }

  async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return new CategoryModel({ id: doc.id, ...doc.data() });
  }

  async create(categoryData) {
    const docRef = this.collection.doc();
    const newCategory = new CategoryModel({ id: docRef.id, ...categoryData });
    await docRef.set(newCategory.toJSON());
    return newCategory;
  }

  async update(id, updateData) {
    const docRef = this.collection.doc(id);
    updateData.updatedAt = new Date().toISOString();
    await docRef.update(updateData);
    return this.findById(id);
  }

  // Soft delete
  async delete(id) {
    const docRef = this.collection.doc(id);
    await docRef.update({ 
      status: 'deleted', 
      updatedAt: new Date().toISOString() 
    });
    return true;
  }
}

module.exports = new CategoryRepository();
