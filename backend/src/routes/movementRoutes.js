const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movementController');

// yeni stok hareketi olusturur
router.post('/', movementController.createMovement);

// stok hareketlerini listeler
router.get('/', movementController.getMovements);

module.exports = router;
