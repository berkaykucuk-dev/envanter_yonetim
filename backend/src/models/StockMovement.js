const mongoose = require('mongoose');

// stok hareketleri modeli
const stockMovementSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // hangi urun
    movement_type: { type: String, enum: ['IN', 'OUT', 'WASTE'], required: true }, // islem tipi
    quantity: { type: Number, required: true }, // islem miktari (her zaman pozitif)
    remaining_quantity: { type: Number }, // fifo icin bu partide kalan miktar (sadece IN islemlerinde gecerli)
    action_reason: { type: String }, // neden cikti veya zayi oldu
    batch_number: { type: String }, // parti numarasi (bozulabilir urunler icin)
    expiration_date: { type: Date }, // son kullanma tarihi (bozulabilir urunler icin)
    notes: { type: String }, // ek aciklama
    performed_by: { type: String } // islemi yapan kullanici id'si veya adi
}, { timestamps: true });

module.exports = mongoose.model('StockMovement', stockMovementSchema);
