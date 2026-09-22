require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const movementRoutes = require('./routes/movementRoutes');

const app = express();

// middleware'ler
app.use(cors());
app.use(express.json());

// rotalar
app.use('/api/products', productRoutes);
app.use('/api/movements', movementRoutes);

// veritabanına bağlan
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('mongodb baglantisi basarili.'))
    .catch((err) => console.error('mongodb baglanti hatasi:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`sunucu ${PORT} portunda calisiyor.`);
});
