class CategoryModel {
  constructor({ id, name, description, type, subCategories = [], status = 'active', createdAt, updatedAt, createdBy, updatedBy, isDefault }) {
    this.id = id;
    this.name = name; // e.g., 'Project Bearer', 'Company', 'Investor'
    this.description = description || '';
    this.type = type; // e.g., 'user_role', 'business_classification', 'project_type'
    this.subCategories = subCategories; // Array of subcategory names or objects
    this.status = status; // 'active', 'inactive', 'deleted'
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();

    //suivie action admin
    this.createdBy = createdBy || null;
    this.updatedBy = updatedBy || null;
    this.isDefault = isDefault || false; //pour la catégorie par défaut
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      subCategories: this.subCategories,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = CategoryModel;
