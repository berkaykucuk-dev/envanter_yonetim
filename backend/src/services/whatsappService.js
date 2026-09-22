const axios = require('axios');
const Settings = require('../models/Settings');
const { log } = require('../utils/logger');

// whatsapp uzerinden mesaj gonderme fonksiyonu
const sendWhatsAppAlert = async (productName, currentStock) => {
    try {
        const apiUrl = process.env.WHATSAPP_API_URL;
        const apiKey = process.env.WHATSAPP_API_KEY;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = { targetTag: 'YÖNETİCİ', messageTemplate: '⚠️ DİKKAT: {UrunAdi} kritik seviyede! Kalan stok: {KalanStok}' };
        }

        if (!apiUrl || !apiKey) {
            log('whatsapp ayarlari (URL veya KEY) eksik, mesaj gonderilemedi.', 'WARN');
            return;
        }

        // Taslaktaki degiskenleri gercek degerlerle degistiriyoruz
        const messageText = settings.messageTemplate
            .replace('{UrunAdi}', productName)
            .replace('{KalanStok}', currentStock);

        // whatsapp otomasyonuna kampanya istegi atiyoruz
        await axios.post(apiUrl, {
            name: `Stok Uyarısı - ${productName}`,
            templateId: null, // serbest formatta mesaj
            messageContent: messageText,
            targetTag: settings.targetTag
        }, {
            headers: {
                'x-api-key': apiKey
            }
        });

        log(`whatsapp uyarisi gonderildi: ${productName} (Etiket: ${settings.targetTag})`, 'INFO');
    } catch (error) {
        log(`whatsapp mesaj gonderim hatasi: ${JSON.stringify(error.response?.data || error.message)}`, 'ERROR');
    }
};

module.exports = {
    sendWhatsAppAlert
};

