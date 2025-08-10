const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Dummy dashboard data for demonstration
router.get('/', auth, async (req, res) => {
  // Replace with real aggregation logic
  res.json({
    totalBalance: 100000,
    income: 50000,
    expenses: 30000,
    investments: 20000,
    latestTransactions: [
      { amount: 1000, type: 'income', date: '2025-08-01', category: 'Salary' },
      { amount: 500, type: 'expense', date: '2025-08-02', category: 'Groceries' },
      { amount: 2000, type: 'investment', date: '2025-08-03', category: 'Stocks' },
      { amount: 300, type: 'expense', date: '2025-08-04', category: 'Transport' },
      { amount: 1500, type: 'income', date: '2025-08-05', category: 'Freelance' }
    ]
  });
});

module.exports = router;
