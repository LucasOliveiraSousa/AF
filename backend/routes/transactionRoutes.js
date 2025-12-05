const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Rotas de transações
router.get('/', transactionController.getAllTransactions);
router.get('/id/:id', transactionController.getTransactionById);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);
router.get('/category/:categoryId', transactionController.getTransactionsByCategory);
router.get('/balance/total', transactionController.getTotalBalance);
router.get('/summary/category', transactionController.getSummaryByCategory);

module.exports = router;
