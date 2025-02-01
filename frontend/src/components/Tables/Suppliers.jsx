import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const ReviewAnalysis = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAggregatedReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/review-analysis/aggregated-reviews");
        setCategoryData(response.data.categoryData);
        setProductData(response.data.productData);
        setRecommendations(response.data.recommendations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching aggregated reviews:", error);
        setLoading(false);
      }
    };

    fetchAggregatedReviews();
  }, []);

  if (loading) return <p>Loading...</p>;

  // Prepare data for graphs
  const categoryNames = categoryData.map((item) => item._id);
  const categoryAvgReviews = categoryData.map((item) => item.avgReview);
  const categoryTotalReviews = categoryData.map((item) => item.totalReviews);

  const productNames = productData.map((item) => item._id);
  const productAvgReviews = productData.map((item) => item.avgReview);
  const productTotalReviews = productData.map((item) => item.totalReviews);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Review Analysis</h1>

      {/* Category vs Average Reviews */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Category vs Average Reviews</h2>
        <Bar
          data={{
            labels: categoryNames,
            datasets: [
              {
                label: "Average Review",
                data: categoryAvgReviews,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          }}
        />
        <p>Best Category: {recommendations.bestCategory._id} with average review {recommendations.bestCategory.avgReview.toFixed(2)}</p>
        <p>Worst Category: {recommendations.worstCategory._id} with average review {recommendations.worstCategory.avgReview.toFixed(2)}</p>
      </div>

      {/* Product vs Average Reviews */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Product vs Average Reviews</h2>
        <Bar
          data={{
            labels: productNames,
            datasets: [
              {
                label: "Average Review",
                data: productAvgReviews,
                backgroundColor: "rgba(153, 102, 255, 0.6)",
              },
            ],
          }}
        />
        <p>Best Product: {recommendations.bestProduct._id} with average review {recommendations.bestProduct.avgReview.toFixed(2)}</p>
        <p>Worst Product: {recommendations.worstProduct._id} with average review {recommendations.worstProduct.avgReview.toFixed(2)}</p>
      </div>

      {/* Total Reviews vs Categories */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Total Reviews vs Categories</h2>
        <Pie
          data={{
            labels: categoryNames,
            datasets: [
              {
                label: "Total Reviews",
                data: categoryTotalReviews,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
              },
            ],
          }}
        />
      </div>

      {/* Total Reviews vs Products */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Total Reviews vs Products</h2>
        <Pie
          data={{
            labels: productNames,
            datasets: [
              {
                label: "Total Reviews",
                data: productTotalReviews,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default ReviewAnalysis;
