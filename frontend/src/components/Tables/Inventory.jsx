import React, { useState, useEffect } from "react";
import axios from "axios";

const MallSalesPage = () => {
  const [malls, setMalls] = useState([]);
  const [selectedMall, setSelectedMall] = useState("");
  const [salesData, setSalesData] = useState([]);

  // Fetch mall names dynamically
  useEffect(() => {
    const fetchMallNames = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/malls/mall-names");
        const mallNames = response.data.malls;
        setMalls(mallNames);
        if (mallNames.length > 0) setSelectedMall(mallNames[0]); // Select the first mall by default
      } catch (error) {
        console.error("Error fetching mall names:", error);
      }
    };

    fetchMallNames();
  }, []);

  // Fetch sales data when the selected mall changes
  useEffect(() => {
    if (selectedMall) {
      const fetchSalesData = async () => {
        try {
          const response = await axios.get("http://localhost:5050/api/malls/sales-analysis");
          setSalesData(response.data.data);
        } catch (error) {
          console.error("Error fetching sales data:", error);
        }
      };

      fetchSalesData();
    }
  }, [selectedMall]);

  const filteredData = salesData.filter((item) => item.shopping_mall === selectedMall);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Shopping Mall Sales Analysis</h1>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        {malls.map((mall) => (
          <button
            key={mall}
            onClick={() => setSelectedMall(mall)}
            style={{
              padding: "10px 20px",
              margin: "0 5px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: mall === selectedMall ? "lightgreen" : "#ccc",
              cursor: "pointer",
            }}
          >
            {mall}
          </button>
        ))}
      </div>

      {/* Sales Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Category</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total Sales</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Average Sales</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Difference</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.category}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.category}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.totalSales.toFixed(2)}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.avgSales.toFixed(2)}</td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  color: item.isAboveAverage ? "green" : "red",
                }}
              >
                {item.isAboveAverage ? "+" : "-"} {item.difference.toFixed(2)}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {!item.isAboveAverage && (
                  <button
                    style={{
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => alert(`Offer discount for ${item.category} in ${selectedMall}`)}
                  >
                    Offer Discount
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MallSalesPage;
