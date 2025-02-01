const Inventory = require('../models/inventory');

// Get all orders
const getInventory = async (req, res, next) => {
  try {
    const inventoryData = await Inventory.find();  // Query MongoDB for inventory data
    console.log('Inventory Data from MongoDB:', inventoryData);  // Add this log for debugging
    if (!inventoryData || inventoryData.length === 0) {
      console.log('No inventory data found');
    }
    res.status(200).json(inventoryData);  // Respond with the data
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ message: 'Error fetching inventory' });
  }
};

module.exports = {
  getInventory,
};
