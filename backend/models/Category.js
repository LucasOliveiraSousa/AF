const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome da categoria é obrigatório'],
    trim: true,
    maxlength: [50, 'Nome não pode ter mais de 50 caracteres']
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Tipo da categoria é obrigatório']
  },
  color: {
    type: String,
    required: [true, 'Cor da categoria é obrigatória'],
    match: [/^#[0-9A-F]{6}$/i, 'Cor deve ser um código hexadecimal válido']
  },
  description: {
    type: String,
    maxlength: [200, 'Descrição não pode ter mais de 200 caracteres']
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

module.exports = mongoose.model('Category', categorySchema);
