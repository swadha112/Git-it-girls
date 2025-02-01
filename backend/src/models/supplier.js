// const mongoose = require('mongoose');

// const supplierSchema = new mongoose.Schema({
//   supplier_id: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   category: { type: String, required: true },
//   performance: { type: Number, required: true },
//   last_order_date: { type: Date, required: true },
// });

// module.exports = mongoose.model('Supplier', supplierSchema, 'Suppliers'); // 'Suppliers' is the collection name in MongoDB

const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplier_id: { type: String, required: true, unique: true },
  supplier_name: { type: String, required: true },
  category: { type: String, required: true },
  performance: { type: Number, required: true },
  last_order_date: { type: Date, required: true },
  email: { type: String, required: true },  // Added email field
});

module.exports = mongoose.model('Supplier', supplierSchema, 'Suppliers');
