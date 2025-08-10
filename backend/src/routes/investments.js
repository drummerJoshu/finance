const express = require('express');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Dummy handlers for demonstration
router.get('/', auth, async (req, res) => {
  res.json([]);
});

router.post('/', auth, [
  body('name').notEmpty(),
  body('amount').isNumeric(),
  body('roi').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  res.status(201).json({ message: 'Investment added' });
});

router.put('/:id', auth, async (req, res) => {
  res.json({ message: 'Investment updated' });
});

router.delete('/:id', auth, async (req, res) => {
  res.json({ message: 'Investment deleted' });
});

module.exports = router;
