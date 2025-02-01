// const express = require('express');
// const { getOrders } = require('../controllers/orderController');

// const router = express.Router();

// // Define the route to get all orders
// router.get('/', getOrders);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { getOrders } = require('../controllers/orderController');

// Debugging statement to confirm route loading
console.log('Order routes loaded.');

// Route to fetch all orders
router.get('/', (req, res, next) => {
  console.log('Request received for /orders'); // Debugging incoming requests
  next();
}, getOrders);

module.exports = router;
