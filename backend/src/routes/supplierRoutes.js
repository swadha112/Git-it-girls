const express = require('express');
const { getSuppliers } = require('../controllers/supplierController');

const router = express.Router();

// Define the route to get all orders
router.get('/', getSuppliers);

module.exports = router;
