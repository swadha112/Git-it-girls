import React from 'react';
import { useNavigate } from 'react-router-dom';
import SolutionsCard from '../../components/Cards/SolutionsCard';
import './Home.css'; // Importing CSS for Home
import img from '../../../public/assets/home.avif';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/ecommerce'); // Navigate to the ECommerce page
  };

  return (
    <div className="home-container ">
      {/* Section 1: Header Content */}
      <div className="content1">
        <div className="text-section">
          <h1>SupplyChainIQ</h1>
          <p>A Revolutionary one-stop solution for your company’s supply chain needs.</p>
          <p>Optimize inventory, manage orders, and enhance logistics with our cutting-edge, AI-powered platform.</p>
          <button className="get-started-btn" onClick={handleGetStartedClick}>
            Get Started
          </button>
        </div>
        <div className="image-section">
          <img src={img} alt="Supply Chain Solutions" />
        </div>
      </div>

      {/* Section 2: Solutions */}
       {/* Section 2: Solutions */}
       <div className="content2">
        <h1 className="heading2">Our Solutions</h1>
        <div className="solutions-grid">
          <SolutionsCard 
            imageSrc="https://www.geospatialworld.net/wp-content/uploads/2023/07/Supply-Chain.jpg" 
            title="End-to-End Supply Chain Visibility" 
            content="Gain real-time insights into every stage of your supply chain." 
          />
          <SolutionsCard 
            imageSrc="https://agribusiness.purdue.edu/wp-content/uploads/PMT_M134_07-scaled-1.jpg" 
            title="Inventory Management" 
            content="Effectively manage your inventory to reduce waste and prevent stockouts." 
          />
          <SolutionsCard 
            imageSrc="https://www.iimu.ac.in/blog/wp-content/uploads/2020/08/supply-chain-mgnt-component.jpg" 
            title="Supplier Management" 
            content="Maintain strong relationships with your suppliers by monitoring their performance." 
          />
          <SolutionsCard 
            imageSrc="https://img.supplychainconnect.com/files/base/ebm/sourcetoday/image/2024/04/662bba218a1c28001e98bc15-dreamstime_40960759.png?auto=format,compress&fit=crop&q=45&h=356&height=356&w=640&width=640" 
            title="Order & Shipment Tracking" 
            content="Track your orders from dispatch to delivery." 
          />
          <SolutionsCard 
            imageSrc="https://www.web-ideas.com.au/uploads/110/289/What-is-Google-Analytics.jpg" 
            title="Analytics and Reporting" 
            content="Harness the power of data to make informed decisions and improve overall supply chain performance." 
          />
          <SolutionsCard 
            imageSrc="https://wltlogistic.com/wp-content/uploads/2022/12/kuebix-10-reasons-to-get-a-tms-1200x660.png" 
            title="Logistics Optimization" 
            content="Optimize your transportation and logistics to reduce costs and improve delivery efficiency." 
          />
          
        </div>
      </div>

      {/* Section 3: Why Choose Us */}
      <div className="content3">
        <h1>Why Choose Us?</h1>
        <div className="benefits-grid">
          <div className="benefit-box">
            <h2>Real-Time Visibility</h2>
            <p>Know where your products are at all times with real-time data updates.</p>
          </div>
          <div className="benefit-box">
            <h2>Data-Driven Decisions</h2>
            <p>Use advanced analytics to optimize your supply chain and reduce costs.</p>
          </div>
          <div className="benefit-box">
            <h2>Efficient Operations</h2>
            <p>Automate processes to minimize delays and inefficiencies in your supply chain.</p>
          </div>
          <div className="benefit-box">
            <h2>User-Friendly Interface</h2>
            <p>Intuitive and easy-to-use platform designed for businesses of all sizes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
