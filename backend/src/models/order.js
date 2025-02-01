const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  product: { type: String, required: true, enum: [
    "cleanser", "toner", "sunscreen", "moisturizer", "face mask", "face cream", 
    "lip oils", "lip balms", "hair serum", "hair shampoo", "hair conditioner", 
    "hair oil", "body lotion", "body wash", "body exfoliator"] 
  }, // Product should be one of these.
  date: { type: String, required: true }, // Date as string
  status: { type: String, required: true },
  quantity: { type: Number, required: true }, // Added quantity
  destination: { type: String, required: true }, // Kept destination
});

module.exports = mongoose.model('Order', orderSchema, 'Orders');
