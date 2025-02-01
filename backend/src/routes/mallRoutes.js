const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
router.get("/mall-names", async (req, res) => {
    try {
      const malls = await Order.distinct("shopping_mall");
      res.status(200).json({ malls });
    } catch (error) {
      console.error("Error fetching mall names:", error);
      res.status(500).json({ message: "Error fetching mall names.", error });
    }
  });
// Calculate total and average sales by category for each mall
router.get("/sales-analysis", async (req, res) => {
    try {
      // Fetch total sales per category for each mall
      const totalSales = await Order.aggregate([
        {
          $group: {
            _id: { shopping_mall: "$shopping_mall", category: "$category" },
            totalSales: { $sum: { $multiply: ["$quantity", "$price"] } },
          },
        },
      ]);
  
      // Calculate total sales by category across all malls
      const totalSalesByCategory = await Order.aggregate([
        {
          $group: {
            _id: "$category",
            totalSales: { $sum: { $multiply: ["$quantity", "$price"] } },
          },
        },
      ]);
  
      // Count the number of unique shopping malls
      const mallCount = await Order.distinct("shopping_mall").then((malls) => malls.length);
  
      // Calculate average sales by dividing total sales by the number of malls
      const averageSales = totalSalesByCategory.map((item) => ({
        category: item._id,
        avgSales: item.totalSales / mallCount,
      }));
  
      // Map average sales by category for quick lookup
      const avgSalesMap = averageSales.reduce((map, item) => {
        map[item.category] = item.avgSales;
        return map;
      }, {});
  
      // Enrich total sales data with average comparison
      const enrichedData = totalSales.map((item) => {
        const avgSales = avgSalesMap[item._id.category] || 0;
        const difference = item.totalSales - avgSales;
        const isAboveAverage = difference >= 0;
  
        return {
          shopping_mall: item._id.shopping_mall,
          category: item._id.category,
          totalSales: item.totalSales,
          avgSales,
          difference: Math.abs(difference),
          isAboveAverage,
        };
      });
  
      res.status(200).json({ data: enrichedData });
    } catch (error) {
      console.error("Error fetching sales analysis:", error);
      res.status(500).json({ message: "Error fetching sales analysis.", error });
    }
  });
  
module.exports = router;
