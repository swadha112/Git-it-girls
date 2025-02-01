const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Sentiment = require("sentiment");

const sentiment = new Sentiment();

// Function to generate sentiment-based rating
function getSentimentScore(text) {
  if (!text || text.trim() === "") return null; // If no review, return null

  const result = sentiment.analyze(text);
  const polarity = result.score;

  if (polarity > 2) return Math.random() * (5 - 4) + 4; // Positive sentiment
  if (polarity >= -2) return Math.random() * (3.5 - 2.5) + 2.5; // Neutral sentiment
  return Math.random() * (2 - 0) + 0; // Negative sentiment
}

// ✅ Route: Create a new order with automatic review rating
router.post("/create", async (req, res) => {
  try {
    const {
      invoice_no,
      customer_id,
      gender,
      age,
      category,
      quantity,
      price,
      payment_method,
      invoice_date,
      shopping_mall,
      product_name,
      review,
    } = req.body;

    // Generate rating if review exists
    const review_rating = review ? getSentimentScore(review) : null;

    const newOrder = new Order({
      invoice_no,
      customer_id,
      gender,
      age,
      category,
      quantity,
      price,
      payment_method,
      invoice_date,
      shopping_mall,
      product_name,
      review,
      review_rating, // ✅ Automatically generated rating
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully!", order: newOrder });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Error creating order", error: err });
  }
});

// ✅ Route: Get all orders with pagination
router.get("/", async (req, res) => {
  console.log("GET /orders endpoint hit"); // Debugging

  try {
    const limit = parseInt(req.query.limit) || 100; // Default to 100 records
    const skip = parseInt(req.query.skip) || 0;

    console.log(`Fetching orders with limit: ${limit}, skip: ${skip}`);
    const orders = await Order.find().limit(limit).skip(skip);
    const totalOrders = await Order.countDocuments();

    res.status(200).json({ orders, total: totalOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
});
router.get("/feature-options", async (req, res) => {
  try {
    const productNames = await Order.distinct("product_name");
    const categories = await Order.distinct("category");
    const ages = await Order.distinct("age");

    res.status(200).json({
      product_name: productNames,
      category: categories,
      age: ages,
    });
  } catch (error) {
    console.error("Error fetching feature options:", error);
    res.status(500).json({ message: "Error fetching feature options", error });
  }
});
module.exports = router;
