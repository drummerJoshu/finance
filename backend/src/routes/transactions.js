const express = require('express');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Dummy handlers for demonstration
router.get('/', auth, async (req, res) => {
  res.json([]);
});

router.post('/', auth, [
  body('amount').isNumeric(),
  body('type').isIn(['income', 'expense']),
  body('date').isISO8601(),
  body('category').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  res.status(201).json({ message: 'Transaction added' });
});

router.delete('/:id', auth, async (req, res) => {
  res.json({ message: 'Transaction deleted' });
});

module.exports = router;
