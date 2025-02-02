const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.get("/rfm-segmentation", async (req, res) => {
  try {
    const rfmData = {
      highRisk: [],
      loyal: [],
      potentialGrowth: [],
      lowFrequencyLowSpenders: [],
    };

    const customers = await Order.aggregate([
      // Ensure invoice_date is converted to Date
      {
        $addFields: {
          invoice_date: {
            $toDate: "$invoice_date", // Convert invoice_date to Date if stored as a string
          },
        },
      },
      {
        $group: {
          _id: "$customer_id",
          recency: {
            $min: {
              $subtract: [new Date(), "$invoice_date"],
            },
          },
          frequency: { $sum: 1 },
          monetary: { $sum: "$price" },
        },
      },
      {
        $project: {
          customer_id: "$_id",
          recency: { $divide: ["$recency", 1000 * 60 * 60 * 24] }, // Convert to days
          frequency: 1,
          monetary: 1,
          rfm_score: {
            $add: [
              { $cond: [{ $lt: ["$recency", 30] }, 5, 1] },
              { $cond: [{ $gt: ["$frequency", 10] }, 5, 1] },
              { $cond: [{ $gt: ["$monetary", 500] }, 5, 1] },
            ],
          },
        },
      },
      { $sort: { rfm_score: -1 } },
    ]);

    customers.forEach((customer) => {
      const { rfm_score } = customer;
      if (rfm_score >= 12) {
        rfmData.loyal.push(customer);
      } else if (rfm_score >= 8) {
        rfmData.potentialGrowth.push(customer);
      } else if (rfm_score >= 5) {
        rfmData.lowFrequencyLowSpenders.push(customer);
      } else {
        rfmData.highRisk.push(customer);
      }
    });

    res.status(200).json(rfmData);
  } catch (error) {
    console.error("Error in RFM Segmentation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
