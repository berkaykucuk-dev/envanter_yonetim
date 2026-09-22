const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// tum urunleri getirir
router.get('/', productController.getProducts);

// yeni urun ekler
router.post('/', productController.createProduct);

module.exports = router;

