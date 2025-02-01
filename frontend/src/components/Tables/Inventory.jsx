import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import jsPDF from 'jspdf'; // Import jsPDF
import html2canvas from 'html2canvas'; // Import html2canvas
// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [activePlant, setActivePlant] = useState(null); // Track active plant
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState([]); // Track forecast data
  const [itemWiseForecast, setItemWiseForecast] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(false); // Track forecast request
  const [showForecast, setShowForecast] = useState(false); // Track whether to show forecast
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('https://supplychain-hyeo-apurvas-projects-a5f1cbec.vercel.app/api/inventory');
        setInventory(response.data);
        setActivePlant(response.data[0]?.plant_name || null); // Set the first plant as default active
        setLoading(false);
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError('Error fetching inventory items');
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) return <p>Loading inventory...</p>;
  if (error) return <p>{error}</p>;

  // Function to handle reorder click (navigate to reorder page)
  const handleReorderClick = (productName, plantName) => {
    navigate('/profile', { state: { productName, plantName } });
  };

  // Function to handle forecast click (fetch forecasted inventory for active plant)
  const handleForecastClick = async () => {
    if (!activePlant) return;

    setLoadingForecast(true);
    try {
      const response = await axios.post(
        'https://supplychain-hyeo-apurvas-projects-a5f1cbec.vercel.app/api/logistics/forecast',
        {
          plant: activePlant, // Send the selected plant name to the backend for forecasting
          periods: 12, //forecast ffor next 12 periods
        },
      );
      setForecast(response.data.timeSeriesForecast); // Set the time-series forecast data returned from the backend
      setItemWiseForecast(response.data.itemWiseForecast); // Set the item-wise forecast data returned from the backend
      setShowForecast(true); // Show forecast section after fetching data
    } catch (err) {
      console.error('Error fetching forecast:', err);
      setForecast([]);
      setItemWiseForecast(null);
    }
    setLoadingForecast(false);
  };

  // Function to download forecast chart as PDF with a report
  const handleDownloadPDF = () => {
    const chartCanvas1 = document.getElementById('forecastChart1');
    const chartCanvas2 = document.getElementById('forecastChart2');

    const pdf = new jsPDF('landscape');
    html2canvas(chartCanvas1).then((canvas1) => {
      const imgData1 = canvas1.toDataURL('image/png');
      pdf.addImage(imgData1, 'PNG', 10, 10, 280, 150);

      // Generate report for inventory
      const reportText = `Plant: ${activePlant} \n\nTime Series Forecast:\n${forecast
        .map((f) => `Date: ${f.date}, Forecast: ${f.forecast}\n`)
        .join('')}\n\n Item-wise Forecast:\n${itemWiseForecast
        .map((f) => `Product: ${f.product_name}, Forecast: ${f.forecast}\n`)
        .join('')}`;
      pdf.text(10, 170, reportText);

      // Second chart
      html2canvas(chartCanvas2).then((canvas2) => {
        const imgData2 = canvas2.toDataURL('image/png');
        pdf.addPage();
        pdf.addImage(imgData2, 'PNG', 10, 10, 280, 150);
        pdf.save('forecast_report.pdf');
      });
    });
  };

  // Prepare forecast data for Chart.js
  const chartDataTimeSeries = {
    labels: forecast
      ? forecast.map((item) => new Date(item.date).toLocaleDateString())
      : [], // X-axis labels (dates)
    datasets: [
      {
        label: `Forecasted Inventory for ${activePlant}`,
        data: forecast ? forecast.map((item) => item.forecast) : [], // Y-axis data (forecasted values)
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  // Prepare item-wise forecast data for Bar Chart
  const chartDataItemWise = {
    labels: itemWiseForecast
      ? itemWiseForecast.map((item) => item.product_name)
      : [], // X-axis labels (item names)
    datasets: [
      {
        label: `Item-wise Forecast for ${activePlant}`,
        data: itemWiseForecast
          ? itemWiseForecast.map((item) => item.forecast)
          : [], // Y-axis data (forecasted values)
        backgroundColor: 'rgba(72,200,75,0.5)',
        borderColor: 'rgba(153,102,255,1)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Dates',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Forecasted Inventory Level',
        },
      },
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Tabs (buttons) for each plant */}
      <div style={{ marginBottom: '20px' }}>
        {Array.isArray(inventory) && inventory.length > 0 ? (
          inventory.map((plant) => (
            <button
              key={plant.plant_name}
              onClick={() => setActivePlant(plant.plant_name)}
              style={{
                padding: '10px 15px',
                marginRight: '10px',
                cursor: 'pointer',
                backgroundColor:
                  activePlant === plant.plant_name ? '#89ff76' : '#f2f2f2',
                color: activePlant === plant.plant_name ? '#000' : '#000',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontWeight: 'bold',
              }}
            >
              {plant.plant_name}
            </button>
          ))
        ) : (
          <p>No plants available</p>
        )}
      </div>

      {/* Display the inventory for the selected plant */}
      {inventory.map((plant) =>
        plant.plant_name === activePlant ? (
          <div key={plant._id} style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px', textAlign: 'left' }}>
              {plant.plant_name} Inventory
            </h3>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                tableLayout: 'fixed',
              }}
            >
              <thead>
                <tr>
                  <th style={headerStyle}>Product Name</th>
                  <th style={headerStyle}>Category</th>
                  <th style={headerStyle}>In Stock</th>
                  <th style={headerStyle}>Reorder Level</th>
                  <th style={headerStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(plant.products) &&
                  plant.products.map((product, i) => (
                    <tr
                      key={`${product.product_name}-${i}`}
                      style={{ borderBottom: '1px solid #ddd' }}
                    >
                      <td style={cellStyle}>{product.product_name}</td>
                      <td style={cellStyle}>{product.category}</td>
                      <td style={cellStyle}>
                        <span
                          style={{
                            padding: '5px 10px',
                            borderRadius: '15px',
                            color: 'white',
                            backgroundColor:
                              product.stock <= product.reorder_level
                                ? '#e74c3c'
                                : '#2ecc71',
                            fontWeight: 'bold',
                          }}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td style={cellStyle}>{product.reorder_level}</td>
                      <td style={cellStyle}>
                      {product.stock <= product.reorder_level && (
                          <button
                            onClick={() =>
                              handleReorderClick(
                                product.product_name,
                                plant.plant_name,
                              )
                            }
                            style={buttonStyle}
                          >
                            Reorder
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Forecast Button below the table */}
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={handleForecastClick}
                style={buttonStyle}
                disabled={loadingForecast}
              >
                {loadingForecast ? 'Predicting...' : 'Forecast Inventory'}
              </button>
            </div>

            {/* Conditionally render forecast charts only when the button is clicked */}
            {showForecast && (
              <>
                {/* Display Time Series Forecast Chart */}
                {forecast && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4>Time Series Forecast for {activePlant}:</h4>
                    <Line
                      id="forecastChart1"
                      data={chartDataTimeSeries}
                      options={chartOptions}
                    />
                  </div>
                )}

                {/* Display Item-wise Forecast Chart */}
                {itemWiseForecast && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4>Item-wise Forecast for {activePlant}:</h4>
                    <Bar
                      id="forecastChart2"
                      data={chartDataItemWise}
                      options={chartOptions}
                    />
                  </div>
                )}

                {/* Download Forecast as PDF Button */}
                <div>
                  <button style={buttonStyle} onClick={handleDownloadPDF}>
                    Download Forecast as PDF
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null,
      )}
    </div>
  );
};

// CSS Styles for the table
const headerStyle = {
  padding: '12px',
  textAlign: 'left',
  backgroundColor: '#f4f4f4',
  fontWeight: 'bold',
  borderBottom: '2px solid #ddd',
};

const cellStyle = {
  padding: '10px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};

const buttonStyle = {
  padding: '8px 12px',
  backgroundColor: '#89ff76',
  color: '#000',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default Inventory;

