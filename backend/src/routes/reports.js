const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Dummy report handler for demonstration
router.get('/', auth, async (req, res) => {
  const { start, end } = req.query;
  // Replace with real aggregation logic
  res.json({
    income: 50000,
    expenses: 30000,
    savings: 20000,
    investments: 10000,
    start,
    end
  });
});

module.exports = router;
