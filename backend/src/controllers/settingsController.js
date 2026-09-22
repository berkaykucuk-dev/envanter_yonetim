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
        const { targetTag, messageTemplate } = req.body;
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({ targetTag, messageTemplate });
        } else {
            settings.targetTag = targetTag;
            settings.messageTemplate = messageTemplate;
        }
        await settings.save();
        log('Mesaj ayarlari guncellendi: ' + targetTag, 'INFO');
        res.json({ success: true, settings });
    } catch (error) {
        log('Ayarlar guncellenirken hata: ' + error.message, 'ERROR');
        res.status(500).json({ error: 'Ayarlar kaydedilemedi' });
    }
};
