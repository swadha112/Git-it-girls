const Order = require('../models/order');
const Logistics = require('../models/logistics');
const Inventory = require('../models/inventory'); // Import the Inventory model
const { geocodeDestination, getNearestSource } = require('../services/geoService'); // Import the service for geocoding and distance

// Plant sources with lat/lng coordinates
const plantSources = [
  { name: 'New York', location: { lat: 40.7128, lng: -74.0060 } }, // New York
  { name: 'Los Angeles', location: { lat: 34.0522, lng: -118.2437 } }, // Los Angeles
  { name: 'Chicago', location: { lat: 41.8781, lng: -87.6298 } },  // Chicago
  { name: 'Houston', location: { lat: 29.7604, lng: -95.3698 } },  // Houston
  { name: 'Phoenix', location: { lat: 33.4484, lng: -112.0740 } }  // Phoenix
];

// Function to generate the next sequential order ID
async function getNextOrderId() {
  const lastOrder = await Order.findOne().sort({ order_id: -1 });
  if (!lastOrder) {
    return 'ORD001'; // Start with ORD001 if no orders exist
  }
  const lastOrderId = lastOrder.order_id;
  const orderNumber = parseInt(lastOrderId.replace('ORD', ''), 10);
  const newOrderNumber = orderNumber + 1;
  return `ORD${newOrderNumber.toString().padStart(3, '0')}`;
}

// Function to generate the next sequential shipment ID
async function getNextShipmentId() {
  const lastShipment = await Logistics.findOne().sort({ shipment_id: -1 });
  const lastShipmentId = lastShipment ? parseInt(lastShipment.shipment_id.replace('SHIP', '')) : 0;
  const newShipmentId = `SHIP${String(lastShipmentId + 1).padStart(3, '0')}`;
  return newShipmentId;
}

// Helper function to format the date as DD-MM-YYYY
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Create a new order and link it with logistics
const createOrder = async (req, res, next) => {
  try {
    const {date, product, quantity, destination } = req.body;

    // Step 1: Geocode the destination (get lat/lng)
    const destinationCoords = await geocodeDestination(destination);

    // Step 2: Calculate nearest source based on geocoded destination coordinates
    const nearestSource = getNearestSource(destinationCoords, plantSources);

    // Step 3: Generate the next sequential order ID
    const newOrderId = await getNextOrderId();

    // Create new order with default status "Processing"
    const newOrder = await Order.create({
      order_id: newOrderId,
      product,
      date,
      status: 'Processing', // Default status set here
      quantity: parseInt(quantity),
      destination
    });

    // Generate a new shipment ID
    const newShipmentId = await getNextShipmentId();

    // Calculate estimated delivery date (e.g., 7 days from now)
    const estimatedDeliveryDate = new Date(new Date().setDate(new Date().getDate() + 7));
    const formattedEstimatedDelivery = formatDate(estimatedDeliveryDate);

    // Create corresponding logistics entry
    await Logistics.create({
      shipment_id: newShipmentId,
      order_id: newOrderId,
      product_name: product,
      quantity,
      source: nearestSource.name, // Assign the nearest source
      sourceLat:  nearestSource.location.lat,
      sourceLng: nearestSource.location.lng,
      destination,
      destinationLat: destinationCoords.lat,
      destinationLng: destinationCoords.lng,
      status: 'Processing',
      estimated_delivery: formattedEstimatedDelivery,
    });

    // Step 4: Update Inventory: Decrease stock of the product at the source plant
    const inventoryUpdate = await Inventory.findOneAndUpdate(
      { plant_name: nearestSource.name, 'products.product_name': product }, 
      { $inc: { 'products.$.stock': -quantity } }, // Decrease the stock
      { new: true }
    );

    if (!inventoryUpdate) {
      return res.status(404).send(`Inventory not found for ${product} at ${nearestSource.name}`);
    }

    res.status(201).json({ 
      message: 'Order and Logistics created successfully with optimized source!',
      order: newOrder,
      logistics: newShipmentId,
      updatedInventory: inventoryUpdate
    });

  } catch (err) {
    next(err); // Handle errors
    console.error('Error creating order:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get all orders
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Update the order status and synchronize with logistics status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { order_id, status } = req.body;

    // Update order status
    const updatedOrder = await Order.findOneAndUpdate({ order_id }, { status }, { new: true });

    // Update logistics status for the corresponding order
    await Logistics.findOneAndUpdate({ order_id }, { status });

    res.json({ message: 'Order and Logistics status updated!', order: updatedOrder });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
};
