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
  body('target').isNumeric(),
  body('current').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  res.status(201).json({ message: 'Goal created' });
});

router.put('/:id', auth, async (req, res) => {
  res.json({ message: 'Goal updated' });
});

router.delete('/:id', auth, async (req, res) => {
  res.json({ message: 'Goal deleted' });
});

module.exports = router;
