const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

const rentPrices = {
  "Cevahir AVM": 5000,
  "Emaar Square Mall": 4500,
  "Forum Istanbul": 4000,
  "Istinye Park": 5500,
  "Kanyon": 6000,
  "Mall of Istanbul": 4700,
  "Metrocity": 4200,
  "Metropol AVM": 3900,
  "Viaport Outlet": 3800,
  "Zorlu Center": 6500,
};

// Route: Profitability analysis for user-selected inventory
router.post("/profitability-analysis", async (req, res) => {
  try {
    const { inventory } = req.body;

    if (!inventory || inventory.length === 0) {
      return res.status(400).json({ message: "Please provide an inventory list." });
    }

    // Filter orders for March 2023
    const filteredOrders = await Order.aggregate([
      {
        $match: {
          invoice_date: {
            $regex: /^(\d{2}-03-2023)$/, // Match dates in March 2023 format: dd-03-2023
          },
          product_name: { $in: inventory },
        },
      },
      {
        $group: {
          _id: { shopping_mall: "$shopping_mall", product_name: "$product_name" },
          totalSales: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);

    // Aggregate rent and profit calculation
    const locationData = Object.keys(rentPrices).map((location) => {
      const productsForLocation = filteredOrders.filter(
        (order) => order._id.shopping_mall === location
      );

      const topProducts = productsForLocation
        .map((product) => ({
          product: product._id.product_name,
          totalSales: product.totalSales,
        }))
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 3); // Top 3 products

      const totalProfit =
        topProducts.reduce((sum, product) => sum + product.totalSales, 0) -
        rentPrices[location];

      return {
        location,
        rent: rentPrices[location],
        topProducts,
        totalProfit,
      };
    });

    res.status(200).json({ data: locationData });
  } catch (error) {
    console.error("Error during profitability analysis:", error);
    res.status(500).json({ message: "Error during profitability analysis.", error });
  }
});

// Fetch distinct product names
router.get("/product-names", async (req, res) => {
  try {
    const productNames = await Order.distinct("product_name");
    res.status(200).json({ productNames });
  } catch (error) {
    console.error("Error fetching product names:", error);
    res.status(500).json({ message: "Error fetching product names.", error });
  }
});

module.exports = router;
