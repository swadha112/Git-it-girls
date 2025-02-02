import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const options = {
  colors: ["#3C50E0", "#89ff76", "#F1C40F", "#E74C3C"], // Colors for categories
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 350,
    stacked: true, // Enable stacked bar chart
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "30%",
      borderRadius: 3,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [], // Shopping mall names (dynamically updated)
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",
    markers: {
      radius: 12,
    },
  },
  fill: {
    opacity: 1,
  },
  yaxis: {
    title: {
      text: "Total Quantity Sold",
    },
  },
};

const ChartTwo = () => {
  const [state, setState] = useState({
    series: [],
    categories: [], // Shopping mall names for X-axis
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/orders?all=true"); // Fetch all orders
        const orders = response.data.orders;

        const mallsData = {}; // Object to store total quantity per mall per category
        const uniqueCategories = new Set(); // To collect unique categories dynamically

        // Aggregate order quantities by category and mall
        orders.forEach((order) => {
          const { shopping_mall, category, quantity } = order;

          if (!mallsData[shopping_mall]) {
            mallsData[shopping_mall] = {};
          }

          if (!mallsData[shopping_mall][category]) {
            mallsData[shopping_mall][category] = 0;
          }

          mallsData[shopping_mall][category] += quantity;
          uniqueCategories.add(category); // Add category to unique set
        });

        // Convert category set to an array
        const categoryList = Array.from(uniqueCategories);

        // Create series data dynamically based on available categories
        const seriesData = categoryList.map((category) => ({
          name: category,
          data: Object.keys(mallsData).map((mall) => mallsData[mall][category] || 0), // Use 0 if category not present in mall
        }));

        // Update the chart state with new data
        setState({
          series: seriesData,
          categories: Object.keys(mallsData), // Malls as X-axis categories
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders data:", error);
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Product Category Sales by Mall
          </h4>
        </div>
      </div>

      <div>
        {!loading ? (
          <ReactApexChart
            options={{
              ...options,
              xaxis: { ...options.xaxis, categories: state.categories }, // Mall names
            }}
            series={state.series} // Stock data for each category
            type="bar"
            height={350}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ChartTwo;
