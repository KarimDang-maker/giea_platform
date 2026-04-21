const categoryService = require('../services/category.service');
const { validationResult } = require('express-validator');
const { seedCategories } = require('../utils/seedData');

class CategoryController {
  
  async getCategories(req, res) {
    try {
      const { type } = req.query;
      let categories = type 
        ? await categoryService.getCategoriesByType(type) 
        : await categoryService.getAllCategories();
      
      // Auto-seed if empty
      if (categories.length === 0) {
        for (const cat of seedCategories) {
          await categoryService.createCategory(cat);
        }
        categories = type 
          ? await categoryService.getCategoriesByType(type) 
          : await categoryService.getAllCategories();
      }

      // Add 'Other' category option for frontend at the end
      categories.push({
        id: 'other_custom',
        name: 'Other (Custom)',
        description: 'Add a custom category',
        type: 'other',
        subCategories: []
      });

      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching categories' });
    }
  }

  async getCategoryById(req, res) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  async createCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

      const newCategory = await categoryService.createCategory(req.body);
      res.status(201).json({ success: true, message: 'Category created successfully', data: newCategory });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Category updated', data: updatedCategory });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      await categoryService.deleteCategory(req.params.id);
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  async addSubCategory(req, res) {
    try {
      const { subCategory } = req.body;
      if (!subCategory) return res.status(400).json({ success: false, message: 'Subcategory name is required' });

      // Allow users to add custom subcategories to the predefined lists
      const updatedCategory = await categoryService.addSubCategory(req.params.id, subCategory);
      res.status(200).json({ success: true, message: 'Subcategory added', data: updatedCategory });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  async removeSubCategory(req, res) {
    try {
      const updatedCategory = await categoryService.removeSubCategory(req.params.id, req.params.subCategory);
      res.status(200).json({ success: true, message: 'Subcategory removed', data: updatedCategory });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CategoryController();
