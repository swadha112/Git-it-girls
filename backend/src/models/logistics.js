const mongoose = require('mongoose');

const logisticsSchema = new mongoose.Schema({
  shipment_id: { type: String, required: true, unique: true }, // Shipment ID
  order_id: { type: String, required: true }, // Order ID
  product_name: { type: String, required: true }, // Product Name
  quantity: { type: Number, required: true }, // Quantity
  source: { type: String, required: true }, // Source (city or address)
  sourceLat: { type: Number, required: true }, // Source latitude
  sourceLng: { type: Number, required: true }, // Source longitude
  destination: { type: String, required: true }, // Destination (city or address)
  destinationLat: { type: Number, required: true }, // Destination latitude
  destinationLng: { type: Number, required: true }, // Destination longitude
  status: { type: String, required: true, enum: ['Processing', 'Shipped', 'Delivered'] }, // Status (options)
  estimated_delivery: { type: String, required: true }, // Estimated Delivery Date (as a string in DD-MM-YYYY format)
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

module.exports = mongoose.model('Logistics', logisticsSchema, 'Logistics');
