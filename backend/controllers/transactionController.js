const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// Obter todas as transações
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('category')
      .sort({ date: -1 });
    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar transações',
      error: error.message
    });
  }
};

// Obter uma transação por ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('category');
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }
    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar transação',
      error: error.message
    });
  }
};

// Criar nova transação
exports.createTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, date, notes } = req.body;

    // Validação básica
    if (!description || !amount || !type || !category || !date) {
      return res.status(400).json({
        success: false,
        message: 'Descrição, valor, tipo, categoria e data são obrigatórios'
      });
    }

    // Verificar se a categoria existe
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }

    const transaction = new Transaction({
      description,
      amount,
      type,
      category,
      date,
      notes
    });

    await transaction.save();
    await transaction.populate('category');

    res.status(201).json({
      success: true,
      message: 'Transação criada com sucesso',
      data: transaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao criar transação',
      error: error.message
    });
  }
};

// Atualizar transação
exports.updateTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, date, notes } = req.body;

    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }

    transaction.description = description || transaction.description;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.date = date || transaction.date;
    transaction.notes = notes || transaction.notes;
    transaction.updatedAt = Date.now();

    await transaction.save();
    await transaction.populate('category');

    res.status(200).json({
      success: true,
      message: 'Transação atualizada com sucesso',
      data: transaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar transação',
      error: error.message
    });
  }
};

// Deletar transação
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Transação deletada com sucesso',
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar transação',
      error: error.message
    });
  }
};

// Obter transações por categoria
exports.getTransactionsByCategory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ category: req.params.categoryId })
      .populate('category')
      .sort({ date: -1 });
    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar transações por categoria',
      error: error.message
    });
  }
};

// Obter saldo total
exports.getTotalBalance = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao calcular saldo',
      error: error.message
    });
  }
};

// Obter resumo por categoria (para o gráfico de pizza)
exports.getSummaryByCategory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ type: 'expense' }).populate('category');
    
    const summary = {};
    transactions.forEach(transaction => {
      const categoryName = transaction.category.name;
      if (!summary[categoryName]) {
        summary[categoryName] = {
          name: categoryName,
          amount: 0,
          color: transaction.category.color
        };
      }
      summary[categoryName].amount += transaction.amount;
    });

    res.status(200).json({
      success: true,
      data: Object.values(summary)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter resumo por categoria',
      error: error.message
    });
  }
};
