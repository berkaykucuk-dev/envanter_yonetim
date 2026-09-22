const express = require('express');
const router = express.Router();
const { getLogs } = require('../utils/logger');

router.get('/', (req, res) => {
    const logs = getLogs();
    res.json({ logs });
});

module.exports = router;

