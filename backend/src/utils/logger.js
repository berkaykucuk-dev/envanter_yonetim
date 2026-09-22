const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../backend.log');

const log = (message, level = 'INFO') => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}\n`;
    
    // Konsola da bas
    if(level === 'ERROR') console.error(formattedMessage.trim());
    else console.log(formattedMessage.trim());

    // Dosyaya yaz
    try {
        fs.appendFileSync(logFilePath, formattedMessage);
    } catch (err) {
        console.error("Log dosyasina yazilamadi", err);
    }
};

const getLogs = () => {
    try {
        if (!fs.existsSync(logFilePath)) return '';
        // Son 1000 satiri almak daha mantikli olabilir ama simdilik tumunu donduruyoruz
        return fs.readFileSync(logFilePath, 'utf8');
    } catch (err) {
        return 'Loglar okunamadi.';
    }
};

module.exports = { log, getLogs };

