const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Route: Fetch aggregated review data
router.get("/aggregated-reviews", async (req, res) => {
  try {
    // Aggregate average reviews and counts by category
    const categoryData = await Order.aggregate([
      { $group: { _id: "$category", avgReview: { $avg: "$review_rating" }, totalReviews: { $sum: 1 } } },
    ]);

    // Aggregate average reviews and counts by product
    const productData = await Order.aggregate([
      { $group: { _id: "$product_name", avgReview: { $avg: "$review_rating" }, totalReviews: { $sum: 1 } } },
    ]);

    // Find best and worst categories and products
    const bestCategory = categoryData.sort((a, b) => b.avgReview - a.avgReview)[0];
    const worstCategory = categoryData.sort((a, b) => a.avgReview - b.avgReview)[0];
    const bestProduct = productData.sort((a, b) => b.avgReview - a.avgReview)[0];
    const worstProduct = productData.sort((a, b) => a.avgReview - b.avgReview)[0];

    res.status(200).json({
      categoryData,
      productData,
      recommendations: {
        bestCategory,
        worstCategory,
        bestProduct,
        worstProduct,
      },
    });
  } catch (err) {
    console.error("Error aggregating review data:", err);
    res.status(500).json({ message: "Error aggregating review data", error: err });
  }
});

module.exports = router;
