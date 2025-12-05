const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar categorias',
      error: error.message
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar categoria',
      error: error.message
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, type, color, description } = req.body;

    // Validação básica
    if (!name || !type || !color) {
      return res.status(400).json({
        success: false,
        message: 'Nome, tipo e cor são obrigatórios'
      });
    }

    const category = new Category({
      name,
      type,
      color,
      description
    });

    await category.save();
    res.status(201).json({
      success: true,
      message: 'Categoria criada com sucesso',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao criar categoria',
      error: error.message
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, type, color, description } = req.body;

    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }

    category.name = name || category.name;
    category.type = type || category.type;
    category.color = color || category.color;
    category.description = description || category.description;
    category.updatedAt = Date.now();

    await category.save();
    res.status(200).json({
      success: true,
      message: 'Categoria atualizada com sucesso',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar categoria',
      error: error.message
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Categoria deletada com sucesso',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar categoria',
      error: error.message
    });
  }
};
