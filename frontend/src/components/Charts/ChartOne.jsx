import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const options = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#89ff76'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
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
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
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
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#89ff76'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [], // This will be updated dynamically
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    min: 0,
    max: 100,
  },
};

const ChartOne = () => {
  const [state, setState] = useState({
    series: [
      {
        name: 'In Stock',
        data: [],
      },
      {
        name: 'Reorder Level',
        data: [],
      },
    ],
    categories: [],
  });

  const [selectedPlant, setSelectedPlant] = useState('New York');
  const [plants] = useState(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await axios.get('https://supplychain-hyeo-apurvas-projects-a5f1cbec.vercel.app/api/inventory');
        const inventory = response.data;

        const plantData = inventory.find((plant) => plant.plant_name === selectedPlant);

        if (plantData && plantData.products) {
          const productNames = plantData.products.map((product) => product.product_name);
          const stockLevels = plantData.products.map((product) => product.stock);
          const reorderLevels = plantData.products.map((product) => product.reorder_level);

          setState({
            series: [
              { name: 'In Stock', data: stockLevels },
              { name: 'Reorder Level', data: reorderLevels },
            ],
            categories: productNames,
          });
        } else {
          console.warn('No products found for selected plant');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, [selectedPlant]);

  const handlePlantChange = (plant) => {
    setSelectedPlant(plant);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-3">
          <div className="flex min-w-[120px]">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">In Stock</p>
            </div>
          </div>
          <div className="flex min-w-[220px]">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-brightgreen">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-brightgreen"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-brightgreen">Reorder Level</p>
            </div>
          </div>
        </div>

        <div className="flex w-full mt-5 sm:mt-0 sm:w-auto justify-center flex-wrap gap-2">
          <div className="inline-flex items-center rounded-md bg-white p-1.5 dark:bg-meta-4 flex-wrap">
            {plants.map((plant) => (
              <button
                key={plant}
                onClick={() => handlePlantChange(plant)}
                className={`rounded py-2 px-4 text-xs font-medium text-center mx-1 mb-2 sm:mb-0 w-full sm:w-28 transition-colors ${
                  selectedPlant === plant
                    ? 'bg-primary text-white'
                    : 'bg-white text-black hover:bg-primary hover:text-white'
                } shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-green dark:hover:text-black`}
              >
                {plant}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5 mt-5">
          {!loading ? (
            <ReactApexChart
              options={{ ...options, xaxis: { ...options.xaxis, categories: state.categories } }}
              series={state.series}
              type="line"
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
