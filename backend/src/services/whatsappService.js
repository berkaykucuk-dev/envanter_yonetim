const axios = require('axios');
const Settings = require('../models/Settings');
const { log } = require('../utils/logger');

// whatsapp uzerinden mesaj gonderme fonksiyonu
// alertType: 'CRITICAL', 'WASTE', 'EXPIRING'
const sendWhatsAppAlert = async (alertType, variables) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) return;

        const apiUrl = settings.whatsappApiUrl;
        const apiKey = settings.whatsappApiKey;
        const tags = settings.targetTags || [];

        if (!apiUrl || !apiKey || tags.length === 0) {
            log('whatsapp ayarlari (URL, KEY veya TAG) eksik, mesaj gonderilemedi.', 'WARN');
            return;
        }

        let template = '';
        if (alertType === 'CRITICAL') template = settings.templateCritical;
        else if (alertType === 'WASTE') template = settings.templateWaste;
        else if (alertType === 'EXPIRING') template = settings.templateExpiring;

        let messageText = template;
        // degiskenleri degistir
        for (const [key, value] of Object.entries(variables)) {
            messageText = messageText.replace(`{${key}}`, value);
        }

        // Her etiket (tag) icin ayri ayri atalim
        for (const tag of tags) {
            try {
                await axios.post(apiUrl, {
                    name: `Sistem Uyarısı - ${alertType}`,
                    templateId: null,
                    messageContent: messageText,
                    targetTag: tag.trim()
                }, { headers: { 'x-api-key': apiKey } });
                log(`whatsapp uyarisi gonderildi: ${alertType} (Etiket: ${tag.trim()})`, 'INFO');
            } catch (err) {
                log(`whatsapp ${tag} etiketine gonderim hatasi: ${err.response?.data?.error || err.message}`, 'ERROR');
            }
        }
    } catch (error) {
        log(`whatsapp genel gonderim hatasi: ${error.message}`, 'ERROR');
    }
};

module.exports = {
    sendWhatsAppAlert
};

