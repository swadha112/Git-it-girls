import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const options = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
  },
  colors: ['#3C50E0', '#8FD0EF', '#89ff76'], // Colors for Processing, Shipped, Delivered
  labels: ['Processing', 'Shipped', 'Delivered'], // Updated labels for order status
  legend: {
    show: false,
    position: 'bottom',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree = () => {
  const [state, setState] = useState({
    series: [0, 0, 0], // Default series for Processing, Shipped, Delivered
  });

  useEffect(() => {
    // Fetch order data from your backend API
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://supplychain-hyeo-apurvas-projects-a5f1cbec.vercel.app/api/orders'); // Update with your API endpoint

        // Process the order data to count the number of each status
        const orders = response.data;
        const processingCount = orders.filter((order) => order.status === 'Processing').length;
        const shippedCount = orders.filter((order) => order.status === 'Shipped').length;
        const deliveredCount = orders.filter((order) => order.status === 'Delivered').length;

        // Update the chart series with the new data
        setState({
          series: [processingCount, shippedCount, deliveredCount],
        });
      } catch (error) {
        console.error('Error fetching orders data:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Order Status Analytics
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series} // Updated series with order status data
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="sm:w-1/2 w-full px-15">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Processing </span>
              <span> {state.series[0]} </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-15">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Shipped </span>
              <span> {state.series[1]} </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-15">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#89ff76]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Delivered </span>
              <span> {state.series[2]} </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
