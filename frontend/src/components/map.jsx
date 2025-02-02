import React, { useState, useEffect } from "react";
import axios from "axios";
import Tree from "react-d3-tree";

const ProfitabilityAnalysis = () => {
  const [productNames, setProductNames] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch product names for inventory buttons
  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/graph/product-names");
        setProductNames(response.data.productNames);
      } catch (error) {
        console.error("Error fetching product names:", error);
      }
    };
    fetchProductNames();
  }, []);

  // Handle inventory button click
  const handleInventoryClick = (product) => {
    setSelectedInventory((prev) =>
      prev.includes(product) ? prev.filter((item) => item !== product) : [...prev, product]
    );
  };

  // Transform backend data to tree format with custom node styles
  const transformToTreeFormat = (data) => {
    if (!data) return null;

    return {
      name: "Locations",
      children: data.map((location) => ({
        name: location.location,
        attributes: {
          Feasibility: location.totalProfit > 0 ? "Feasible" : "Not Feasible",
        },
        nodeSvgShape: {
          shape: "circle",
          shapeProps: {
            r: 15,
            fill: location.totalProfit > 0 ? "lightgreen" : "red",
          },
        },
        children: [
          {
            name: `Rent: $${location.rent}`,
          },
          {
            name: "Top Inventory",
            children: location.topProducts.map((product) => ({
              name: `${product.product}: $${product.totalSales.toFixed(2)}`,
            })),
          },
          {
            name: `Profit Margin: $${location.totalProfit.toFixed(2)}`,
          },
          {
            name: `Feasibility: ${
              location.totalProfit > 0 ? "Feasible" : "Not Feasible"
            }`,
          },
        ],
      })),
    };
  };

  // Submit selected inventory for profitability analysis
  const handleAnalyze = async () => {
    if (selectedInventory.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5050/api/graph/profitability-analysis", {
        inventory: selectedInventory,
      });
      const transformedData = transformToTreeFormat(response.data.data);
      setGraphData(transformedData);
    } catch (error) {
      console.error("Error performing profitability analysis:", error);
      alert("An error occurred while performing the analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Profitability Analysis</h1>
      <p>Select Inventory:</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
        {productNames.map((product, index) => (
          <button
            key={index}
            onClick={() => handleInventoryClick(product)}
            style={{
              padding: "10px 15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              background: selectedInventory.includes(product) ? "lightgreen" : "white",
              cursor: "pointer",
            }}
          >
            {product}
          </button>
        ))}
      </div>
      <button
        onClick={handleAnalyze}
        style={{
          padding: "10px 20px",
          borderRadius: "5px",
          background: "lightgreen",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Analyze
      </button>

      {loading && <p>Loading...</p>}

      {graphData && (
        <div style={{ marginTop: "20px", width: "100%", height: "500px" }}>
          <h2>Profitability Analysis Graph</h2>
          <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <Tree
              data={graphData}
              orientation="vertical"
              translate={{ x: 500, y: 50 }}
              pathFunc="diagonal"
              zoomable
              collapsible
              initialDepth={1}
              nodeSize={{ x: 300, y: 150 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitabilityAnalysis;
