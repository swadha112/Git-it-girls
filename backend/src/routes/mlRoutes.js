const express = require("express");
const router = express.Router();
const trainModel = require("../models/mlModel"); // Import the ML model
const Order = require("../models/Order"); // MongoDB Order model

// Route to handle prediction requests
// API Endpoint
router.post("/predict", async (req, res) => {
  try {
    const { selectedFeatures } = req.body;

    if (!selectedFeatures || Object.keys(selectedFeatures).length === 0) {
      return res.status(400).json({ message: "No features provided for prediction." });
    }

    console.log("Selected Features Received:", selectedFeatures);

    const selectedFeatureNames = Object.keys(selectedFeatures);
    const selectedFeatureValues = Object.values(selectedFeatures);

    const result = await trainModel(selectedFeatureNames, selectedFeatureValues);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).json({ message: "Error during prediction", error: error.message });
  }
});

// Route to fetch feature options dynamically
router.get("/feature-options", async (req, res) => {
  try {
    const productNames = await Order.distinct("product_name");
    const categories = await Order.distinct("category");
    const ages = await Order.distinct("age");
    const genders = await Order.distinct("gender");

    res.status(200).json({
      product_name: productNames,
      category: categories,
      age: ages,
      gender: genders,
    });
  } catch (error) {
    console.error("Error fetching feature options:", error);
    res.status(500).json({ message: "Error fetching feature options.", error });
  }
});

module.exports = router;
