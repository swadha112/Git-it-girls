const mongoose = require('mongoose');
const inventorySchema = new mongoose.Schema({
  plant_id: { type: String, required: true, unique: true },
  plant_name: { type: String, required: true },
  products: [
    {
      category: { type: String, required: true },
      product_name: { type: String, required: true },
      stock: { type: Number, required: true },
      reorder_level: { type: Number, required: true }
    }
  ]
}, { collection: 'Inventory' });  // Specify the collection name

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = mongoose.model('Inventory', inventorySchema);
