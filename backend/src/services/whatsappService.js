const axios = require('axios');

// whatsapp uzerinden mesaj gonderme fonksiyonu
const sendWhatsAppAlert = async (productName, currentStock) => {
    try {
        const apiUrl = process.env.WHATSAPP_API_URL;
        const apiKey = process.env.WHATSAPP_API_KEY;
        const targetTag = process.env.WHATSAPP_TARGET_TAG;

        if (!apiUrl || !apiKey || !targetTag) {
            console.log('whatsapp ayarlari eksik, mesaj gonderilemedi.');
            return;
        }

        const messageText = `⚠️ DİKKAT: ${productName} adlı ürünün stoğu kritik seviyeye düştü! (Kalan: ${currentStock})`;

        // whatsapp otomasyonuna kampanya istegi atiyoruz
        await axios.post(apiUrl, {
            name: `Stok Uyarısı - ${productName}`,
            templateId: null, // serbest formatta mesaj
            messageContent: messageText,
            targetTag: targetTag
        }, {
            headers: {
                'x-api-key': apiKey
            }
        });

        console.log(`whatsapp uyarisi gonderildi: ${productName}`);
    } catch (error) {
        console.error('whatsapp mesaj gonderim hatasi:', error.response?.data || error.message);
    }
};

module.exports = {
    sendWhatsAppAlert
};

