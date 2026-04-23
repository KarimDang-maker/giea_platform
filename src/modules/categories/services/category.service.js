const categoryRepository = require('../repositories/category.repository');

class CategoryService {
  async getAllCategories() {
    return await categoryRepository.findAll();
  }

  async getCategoriesByType(type) {
    return await categoryRepository.findByType(type);
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category || category.status === 'deleted') {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    return category;
  }

  async createCategory(categoryData) {
    return await categoryRepository.create(categoryData);
  }

  async updateCategory(id, categoryData) {
    await this.getCategoryById(id);
    return await categoryRepository.update(id, categoryData);
  }

  async deleteCategory(id) {
    await this.getCategoryById(id);
    return await categoryRepository.delete(id);
  }

  async addSubCategory(categoryId, subCategoryName) {
    const category = await this.getCategoryById(categoryId);
    const subCategories = category.subCategories || [];
    
    if (subCategories.includes(subCategoryName)) {
      const error = new Error('This subcategory already exists');
      error.statusCode = 400;
      throw error;
    }

    subCategories.push(subCategoryName);
    return await categoryRepository.update(categoryId, { subCategories });
  }

  async removeSubCategory(categoryId, subCategoryName) {
    const category = await this.getCategoryById(categoryId);
    const subCategories = (category.subCategories || []).filter(sub => sub !== subCategoryName);
    return await categoryRepository.update(categoryId, { subCategories });
  }

  /**
   * Nettoie et normalise le nom d'une catégorie (accents, casse, espaces).
   * @private
   */
  _normalizeName(name) {
    if (!name) return "";
    return name
      .trim()
      .normalize("NFD") // Sépare les caractères de leurs accents
      .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Trouve une catégorie par son nom et son type, ou la crée si elle n'existe pas.
   * C'est la méthode clé pour l'intégration avec le module Projet.
   * @param {string} name - Le nom de la catégorie (ex: "Environnement").
   * @param {string} type - Le type de catégorie (ex: "project_sector").
   * @returns {Promise<Object>} La catégorie trouvée ou créée.
   */
  async getOrCreateByName(name, type) {
    const normalizedName = this._normalizeName(name);

    // 1. Chercher si la catégorie existe déjà avec ce nom et ce type.
    let category = await categoryRepository.findOneBy({ name: normalizedName, type: type });

    if (category) {
      return category;
    }

    // 2. Si la catégorie n'existe pas, la créer.
    const newCategoryData = {
      name: normalizedName,
      type: type,
      status: 'active', // Statut par défaut pour les catégories créées à la volée.
    };
    return await this.createCategory(newCategoryData); // Utilise la méthode createCategory existante
  }
}

module.exports = new CategoryService();
