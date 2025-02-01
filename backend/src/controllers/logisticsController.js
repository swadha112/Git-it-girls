const Logistics = require('../models/logistics');
const Order = require('../models/order');
const { createObjectCsvStringifier } = require('csv-writer'); // Use the stringifier version for in-memory CSV
const ARIMA = require('arima');

// Fetch all logistics data
const getLogistics = async (req, res, next) => {
  try {
    const logistics = await Logistics.find();
    res.json(logistics);
  } catch (err) {
    next(err); // Pass errors to the error handler
  }
};

// Update shipment status and synchronize with the order status
const updateShipmentStatus = async (req, res, next) => {
  try {
    const { shipment_id, newStatus } = req.body;

    // Find the logistics entry by shipment_id and update the status
    const updatedShipment = await Logistics.findOneAndUpdate(
      { shipment_id },
      { status: newStatus },
      { new: true }
    );

    if (updatedShipment) {
      // Also update the status in the Orders table using order_id
      await Order.findOneAndUpdate(
        { order_id: updatedShipment.order_id },
        { status: newStatus }
      );
    }

    res.json(updatedShipment);
  } catch (err) {
    next(err); // Pass errors to the error handler
  }
};

const forecastLogistics = async (req, res, next) => {
  const { plant, periods } = req.body;

  try {
    const logisticsData = await Logistics.find({ source: plant });

    if (!logisticsData || logisticsData.length === 0) {
      return res.status(404).json({ message: `No logistics data found for plant ${plant}` });
    }

    // Use csv-writer's stringifier to generate CSV in-memory
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'estimated_delivery', title: 'Date' },
        { id: 'quantity', title: 'Quantity' },
        { id: 'product_name', title: 'Product Name' },
      ]
    });

    const dataForCSV = logisticsData.map(item => ({
      estimated_delivery: item.estimated_delivery,
      quantity: item.quantity,
      product_name: item.product_name
    }));

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(dataForCSV);

  
    // Prepare data for ARIMA prediction
    const quantities = logisticsData.map(item => item.quantity);
    console.log("Quantities for ARIMA model: ", quantities);

    if (quantities.length < 2) {
      return res.status(400).json({ message: 'Not enough data for forecasting' });
    }

    // Initialize ARIMA model
    const arima = new ARIMA({
      p: 2,  // autoregressive order
      d: 1,  // differencing order
      q: 2,  // moving average order
      verbose: true
    }).train(quantities);

    // Forecast for the given number of periods
    const [forecastedQuantities] = arima.predict(periods || 12);  // Extract only the forecasted values

    // Prepare forecast data with future dates
    const today = new Date();
    const timeSeriesForecast = forecastedQuantities.map((forecast, idx) => {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + (idx + 1)); // Increment the date by 1 for each prediction
      return {
        date: forecastDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        forecast: forecast
      };
    });

    // Generate item-wise forecast based on product names
    const itemWiseForecast = logisticsData.map(item => ({
      product_name: item.product_name,
      forecast: item.quantity // For simplicity, we can use current quantity (could be further customized)
    }));

    // Send the forecast to the frontend
    res.status(200).json({ timeSeriesForecast, itemWiseForecast });
  } catch (err) {
    console.error('Error generating forecast:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error generating forecast', error: err.message });
    }
  }
};

module.exports = {
  getLogistics,
  updateShipmentStatus,
  forecastLogistics,
};
