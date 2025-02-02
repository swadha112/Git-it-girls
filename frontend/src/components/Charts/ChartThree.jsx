import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const options = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#3C50E0", "#E74C3C", "#F1C40F", "#89ff76"], // Colors for each RFM category
  labels: ["Low-Frequency Low Spenders", "At-Risk Customers", "High-Risk Customers", "Loyal Customers"], 
  legend: {
    show: true,
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
};

const ChartThree = () => {
  const [state, setState] = useState({
    series: [0, 0, 0, 0], // Default values for Loyal, At-Risk, High-Risk, Low-Frequency
  });

  useEffect(() => {
    const fetchRFMData = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/analysis/rfm-segmentation");

        const rfmData = response.data;

        // Get the count of customers in each category
        const loyalCount = rfmData.loyal.length;
        const atRiskCount = rfmData.potentialGrowth.length;
        const highRiskCount = rfmData.highRisk.length;
        const lowFreqCount = rfmData.lowFrequencyLowSpenders.length;

        // Update the chart series
        setState({
          series: [ lowFreqCount, atRiskCount, highRiskCount,loyalCount],
        });
      } catch (error) {
        console.error("Error fetching RFM data:", error);
      }
    };

    fetchRFMData();
  }, []);

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Customer Segmentation
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={state.series} type="donut" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="sm:w-1/2 w-full px-15">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span>Loyal Customers </span>
              <span> {state.series[0]} </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-15">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#E74C3C]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> At-Risk Customers </span>
              <span> {state.series[1]} </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-15">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#F1C40F]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> High-Risk Customers </span>
              <span> {state.series[2]} </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-15">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#89ff76]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Low-Frequency Low Spenders</span>
              <span> {state.series[3]} </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
