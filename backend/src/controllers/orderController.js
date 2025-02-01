const mongoose = require('mongoose');
const Order = require('../models/Order');

exports.getOrders = async (req, res) => {
  console.log('GET /orders endpoint hit'); // Debugging
  try {
    const limit = parseInt(req.query.limit) || 100; // Default to 100 records
    const skip = parseInt(req.query.skip) || 0;

    console.log(`Fetching orders with limit: ${limit}, skip: ${skip}`);
    const orders = await Order.find().limit(limit).skip(skip);
    const totalOrders = await Order.countDocuments();

    res.status(200).json({ orders, total: totalOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

