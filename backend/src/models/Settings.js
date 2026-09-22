const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    targetTag: { type: String, default: 'YÖNETİCİ' },
    messageTemplate: { type: String, default: '⚠️ DİKKAT: {UrunAdi} kritik seviyede! Kalan stok: {KalanStok}' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
