import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const options = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'bar',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: 'category',
    categories: [], // To be dynamically populated
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    min: 0,
    title: {
      text: 'Number of Orders',
    },
  },
};

const ChartOne = () => {
  const [state, setState] = useState({
    series: [
      {
        name: 'Number of Orders',
        data: [],
      },
    ],
    categories: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/orders?all=true');
        const orders = response.data.orders;

        // Aggregate order count by location
        const locationData = {};
        orders.forEach((order) => {
          const location = order.shopping_mall;
          if (locationData[location]) {
            locationData[location]++;
          } else {
            locationData[location] = 1;
          }
        });

        // Extract locations and their order counts
        const categories = Object.keys(locationData); // Locations
        const orderCounts = Object.values(locationData); // Number of orders per location

        setState({
          series: [
            {
              name: 'Number of Orders',
              data: orderCounts,
            },
          ],
          categories,
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching order data:', error);
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div>
          <p className="font-semibold text-primary">Orders by Location</p>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5 mt-5">
          {!loading ? (
            <ReactApexChart
              options={{ ...options, xaxis: { ...options.xaxis, categories: state.categories } }}
              series={state.series}
              type="bar"
              height={window.innerWidth < 768 ? 250 : 350} // Adjust chart height based on screen width
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
