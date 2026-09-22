const Settings = require('../models/Settings');
const { log } = require('../utils/logger');

exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.json(settings);
    } catch (error) {
        log('Ayarlar getirilirken hata: ' + error.message, 'ERROR');
        res.status(500).json({ error: 'Ayarlar alinamadi' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { whatsappApiUrl, whatsappApiKey, targetTags, templateCritical, templateWaste, templateExpiring } = req.body;
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({ whatsappApiUrl, whatsappApiKey, targetTags, templateCritical, templateWaste, templateExpiring });
        } else {
            settings.whatsappApiUrl = whatsappApiUrl;
            settings.whatsappApiKey = whatsappApiKey;
            settings.targetTags = targetTags;
            settings.templateCritical = templateCritical;
            settings.templateWaste = templateWaste;
            settings.templateExpiring = templateExpiring;
        }
        await settings.save();
        log('Mesaj ayarlari guncellendi: ' + targetTags.join(','), 'INFO');
        res.json({ success: true, settings });
    } catch (error) {
        log('Ayarlar guncellenirken hata: ' + error.message, 'ERROR');
        res.status(500).json({ error: 'Ayarlar kaydedilemedi' });
    }
};

