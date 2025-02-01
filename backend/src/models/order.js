const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  invoice_no: { type: String, required: true },
  customer_id: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  payment_method: { type: String, required: true },
  invoice_date: { type: String, required: true },
  shopping_mall: { type: String, required: true },
  product_name: { type: String, required: true },
  review: { type: String, required: true },
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema, 'Order');

module.exports = Order;
