require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const movementRoutes = require('./routes/movementRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const logRoutes = require('./routes/logRoutes');
const { log } = require('./utils/logger');

const app = express();

// middleware'ler
app.use(cors());
app.use(express.json());

// rotalar
app.use('/api/products', productRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/logs', logRoutes);

// veritabanına bağlan
mongoose.connect(process.env.MONGODB_URI)
    .then(() => log('mongodb baglantisi basarili.', 'INFO'))
    .catch((err) => log('mongodb baglanti hatasi: ' + err, 'ERROR'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    log(`sunucu ${PORT} portunda calisiyor.`, 'INFO');
});

