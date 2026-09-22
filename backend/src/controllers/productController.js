const Product = require('../models/Product');

// tum urunleri getir
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'urunler cekilemedi' });
    }
};

// yeni urun ekle
exports.createProduct = async (req, res) => {
    try {
        // urun verisi
        const { sku_code, name, unit, min_stock_level, is_perishable } = req.body;

        // ayni kodlu urun var mi
        const existing = await Product.findOne({ sku_code });
        if (existing) {
            return res.status(400).json({ error: 'bu stok kodu zaten var' });
        }

        // kaydet
        const product = new Product({
            sku_code,
            name,
            unit,
            min_stock_level,
            is_perishable
        });
        await product.save();
        
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'urun eklenemedi' });
    }
};
