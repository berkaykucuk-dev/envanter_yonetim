const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    whatsappApiUrl: { type: String, default: 'http://host.docker.internal:3000/api/v1/campaigns' },
    whatsappApiKey: { type: String, default: '' },
    targetTags: { type: [String], default: ['YÖNETİCİ'] },
    templateCritical: { type: String, default: '⚠️ DİKKAT: {UrunAdi} kritik seviyede! Kalan stok: {KalanStok}' },
    templateWaste: { type: String, default: '🗑️ ZAYİ BİLDİRİMİ: {UrunAdi} ürününden {Miktar} adet zayi çıkışı yapıldı. Kalan stok: {KalanStok}' },
    templateExpiring: { type: String, default: '⏳ SKT UYARISI: {UrunAdi} ürününün son kullanma tarihi yaklaşıyor! Kalan stok: {KalanStok}' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);

