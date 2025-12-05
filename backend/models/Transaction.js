const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Descrição da transação é obrigatória'],
    trim: true,
    maxlength: [100, 'Descrição não pode ter mais de 100 caracteres']
  },
  amount: {
    type: Number,
    required: [true, 'Valor da transação é obrigatório'],
    min: [0.01, 'Valor deve ser maior que 0']
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Tipo da transação é obrigatório']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Categoria é obrigatória']
  },
  date: {
    type: Date,
    required: [true, 'Data da transação é obrigatória']
  },
  notes: {
    type: String,
    maxlength: [200, 'Notas não podem ter mais de 200 caracteres']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
