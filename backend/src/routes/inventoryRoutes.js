const express = require('express');
const { getInventory } = require('../controllers/inventoryController');

const router = express.Router();

// Define the route to get all orders
router.get('/', getInventory);

module.exports = router;
