import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const options = {
  colors: ['#3C50E0', '#89ff76', '#F1C40F', '#E74C3C'], // Add colors for each category
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
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
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [], // Will be dynamically set
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',
    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

const ChartTwo = () => {
  const [state, setState] = useState({
    series: [
      { name: 'Skin Care', data: [] },
      { name: 'Lip Care', data: [] },
      { name: 'Hair Care', data: [] },
      { name: 'Body Care', data: [] },
    ],
    categories: [], // Plant names for X-axis
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://supplychain-hyeo-apurvas-projects-a5f1cbec.vercel.app/api/inventory');
        const inventory = response.data;

        // Extract plant names for the X-axis
        const plantNames = inventory.map((plant) => plant.plant_name);

        // Initialize arrays to store stock levels for each category across plants
        const skinCareStock = [];
        const lipCareStock = [];
        const hairCareStock = [];
        const bodyCareStock = [];

        // Loop through each plant's products and sum the stock levels by category
        inventory.forEach((plant) => {
          let skinCareSum = 0;
          let lipCareSum = 0;
          let hairCareSum = 0;
          let bodyCareSum = 0;

          plant.products.forEach((product) => {
            switch (product.category) {
              case 'Skin Care':
                skinCareSum += product.stock;
                break;
              case 'Lip Care':
                lipCareSum += product.stock;
                break;
              case 'Hair Care':
                hairCareSum += product.stock;
                break;
              case 'Body Care':
                bodyCareSum += product.stock;
                break;
              default:
                break;
            }
          });

          // Push the sums into their respective arrays
          skinCareStock.push(skinCareSum);
          lipCareStock.push(lipCareSum);
          hairCareStock.push(hairCareSum);
          bodyCareStock.push(bodyCareSum);
        });

        // Set the state with the formatted data
        setState({
          series: [
            { name: 'Skin Care', data: skinCareStock },
            { name: 'Lip Care', data: lipCareStock },
            { name: 'Hair Care', data: hairCareStock },
            { name: 'Body Care', data: bodyCareStock },
          ],
          categories: plantNames,
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Product Categories Stock by Plant
          </h4>
        </div>
      </div>

      <div>
        {!loading ? (
          <ReactApexChart
            options={{
              ...options,
              xaxis: { ...options.xaxis, categories: state.categories },
            }}
            series={state.series}
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
