// const express = require('express');
// const { getLogistics } = require('../controllers/logisticsController');

// const router = express.Router();

// // Define the route to get all orders
// router.get('/', getLogistics);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { getLogistics, updateShipmentStatus, forecastLogistics } = require('../controllers/logisticsController');

// Route to get all logistics data
router.get('/', getLogistics);

// Route to update shipment status
router.put('/status', updateShipmentStatus);

// Route to forecast inventory for a specific plant (source)
router.post('/forecast', forecastLogistics);

module.exports = router;

