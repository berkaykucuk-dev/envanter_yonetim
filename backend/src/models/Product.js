const mongoose = require('mongoose');

// urun modeli
const productSchema = new mongoose.Schema({
    sku_code: { type: String, required: true, unique: true }, // benzersiz stok kodu
    name: { type: String, required: true }, // urun adi
    unit: { type: String, required: true }, // olcu birimi (kg, lt, adet vb.)
    min_stock_level: { type: Number, required: true, default: 0 }, // uyari verilecek minimum miktar
    is_perishable: { type: Boolean, default: false }, // bozulabilir mi
    current_stock: { type: Number, default: 0 } // guncel stok miktari
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
