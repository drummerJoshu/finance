const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await fetch('https://api.exchangerate.host/latest?base=KES');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch exchange rates' });
  }
});

module.exports = router;
