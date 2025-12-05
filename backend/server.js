const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Importar rotas
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conectar ao MongoDB Atlas
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/gestor_financeiro?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado ao MongoDB Atlas'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Rotas de Health Check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Servidor está funcionando!' });
});

// Rotas da API
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});
