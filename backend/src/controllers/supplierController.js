const Supplier = require('../models/supplier');

// Get all suppliers
const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    next(err); // Pass errors to error handler
  }
};

module.exports = {
  getSuppliers,
};
