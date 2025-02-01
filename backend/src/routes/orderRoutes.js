// const express = require('express');
// const { getOrders } = require('../controllers/orderController');

// const router = express.Router();

// // Define the route to get all orders
// router.get('/', getOrders);

// module.exports = router;


const express = require('express');
const { getOrders, createOrder, updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();

// Route to get all orders
router.get('/', getOrders);

// Route to create a new order
router.post('/', createOrder);

// Route to update order status
router.put('/status', updateOrderStatus);

module.exports = router;
