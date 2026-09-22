const StockMovement = require('../models/StockMovement');
const Product = require('../models/Product');
const { sendWhatsAppAlert } = require('../services/whatsappService');

// yeni stok hareketi ekle
exports.createMovement = async (req, res) => {
    try {
        const { product_id, movement_type, quantity, action_reason, batch_number, expiration_date, notes, performed_by } = req.body;

        // urun var mi kontrol et
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ error: 'urun bulunamadi' });
        }

        if (quantity <= 0) {
            return res.status(400).json({ error: 'miktar sifirdan buyuk olmali' });
        }

        let newMovement;

        // stok girisi
        if (movement_type === 'IN') {
            // bozulabilir ise parti no ve skt zorunlu
            if (product.is_perishable && (!batch_number || !expiration_date)) {
                return res.status(400).json({ error: 'bozulabilir urunler icin parti numarasi ve skt zorunludur' });
            }

            newMovement = new StockMovement({
                product_id, movement_type, quantity, remaining_quantity: quantity,
                action_reason, batch_number, expiration_date, notes, performed_by
            });

            product.current_stock += quantity;
        } 
        // stok cikisi veya zayi
        else if (movement_type === 'OUT' || movement_type === 'WASTE') {
            // negatif stok kontrolu
            if (product.current_stock < quantity) {
                return res.status(400).json({ error: 'yetersiz stok' });
            }

            // fifo mantigi ile dusum (bozulabilir urunler icin)
            if (product.is_perishable) {
                let remainingToDeduct = quantity;
                
                // skt'ye gore sirali ve icinde urun kalmis partileri bul
                const batches = await StockMovement.find({
                    product_id,
                    movement_type: 'IN',
                    remaining_quantity: { $gt: 0 }
                }).sort({ expiration_date: 1 });

                // skt gecmis urun var mi kontrolu yapilabilir ama basitce fifo isliyoruz
                for (let batch of batches) {
                    if (remainingToDeduct === 0) break;

                    // tarihi gecmis mi diye kucuk bir uyari firlatilabilirdi ama simdilik dusuyoruz
                    if (batch.remaining_quantity >= remainingToDeduct) {
                        batch.remaining_quantity -= remainingToDeduct;
                        await batch.save();
                        remainingToDeduct = 0;
                    } else {
                        remainingToDeduct -= batch.remaining_quantity;
                        batch.remaining_quantity = 0;
                        await batch.save();
                    }
                }
            }

            newMovement = new StockMovement({
                product_id, movement_type, quantity,
                action_reason, notes, performed_by
            });

            product.current_stock -= quantity;
        } else {
            return res.status(400).json({ error: 'gecersiz hareket tipi' });
        }

        await newMovement.save();
        await product.save();

        // kritik stok kontrolu
        if ((movement_type === 'OUT' || movement_type === 'WASTE') && product.current_stock < product.min_stock_level) {
            // whatsapp uyarisi tetikle
            sendWhatsAppAlert(product.name, product.current_stock);
        }

        res.status(201).json({ success: true, movement: newMovement, current_stock: product.current_stock });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'stok hareketi kaydedilemedi' });
    }
};

// hareketi gecmisini getir
exports.getMovements = async (req, res) => {
    try {
        const { product_id } = req.query;
        let filter = {};
        if (product_id) {
            filter.product_id = product_id;
        }

        const movements = await StockMovement.find(filter)
            .populate('product_id', 'name sku_code')
            .sort({ createdAt: -1 });
            
        res.status(200).json(movements);
    } catch (error) {
        res.status(500).json({ error: 'hareketler cekilemedi' });
    }
};
