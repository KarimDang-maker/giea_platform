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
}

module.exports = new CategoryService();
