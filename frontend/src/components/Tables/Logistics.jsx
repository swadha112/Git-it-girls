import React, { useState, useEffect } from 'react';
import axios from 'axios';
import L from 'leaflet'; // Import Leaflet for map functionality
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

const Logistics = () => {
  const [logistics, setLogistics] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    // Fetch logistics data from the backend
    const fetchLogistics = async () => {
      try {
        const response = await axios.get('https://supplychain-hyeo-apurvas-projects-a5f1cbec.vercel.app/api/logistics');
        setLogistics(response.data);
      } catch (err) {
        console.error('Error fetching logistics data', err);
      }
    };

    fetchLogistics();
  }, []);

  const handleStatusUpdate = async (shipment_id) => {
    if (!newStatus) {
      alert('Please select a new status');
      return;
    }
    
    try {
      await axios.put(`https://supplychain-hyeo-apurvas-projects-a5f1cbec.vercel.app/api/logistics/status`, { shipment_id, newStatus });
      // Re-fetch updated logistics data
      const updatedLogistics = await axios.get('https://supplychain-hyeo-apurvas-projects-a5f1cbec.vercel.app/api/logistics');
      setLogistics(updatedLogistics.data);
      setNewStatus(''); // Reset status after saving
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleTrackOrder = (shipment) => {
    if (shipment.sourceLat && shipment.sourceLng && shipment.destinationLat && shipment.destinationLng) {
      setSelectedShipment(shipment);

      if (map) {
        map.remove(); // Remove the previous map before creating a new one
      }

      // Create a new map centered at the source location
      const newMap = L.map('map').setView([shipment.sourceLat, shipment.sourceLng], 6);

      // Set up the OSM tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(newMap);

      // Add markers for source and destination
      const sourceMarker = L.marker([shipment.sourceLat, shipment.sourceLng]).addTo(newMap);
      const destinationMarker = L.marker([shipment.destinationLat, shipment.destinationLng]).addTo(newMap);

      // Add popup information to markers
      sourceMarker.bindPopup('Source Location').openPopup();
      destinationMarker.bindPopup('Destination Location');

      // Draw a route between source and destination
      const route = L.polyline([[shipment.sourceLat, shipment.sourceLng], [shipment.destinationLat, shipment.destinationLng]], { color: 'blue' }).addTo(newMap);

      // Fit the map bounds to show the full route
      newMap.fitBounds(route.getBounds());

      // Save the map instance to the state
      setMap(newMap);
    } else {
      alert("Latitude and Longitude are missing for this shipment.");
    }
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '900px', // Ensure table doesn't get too small on small screens
  };
  
  const thStyle = {
    padding: '5px 7px', // Adjust the padding for more space between columns in the header
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  };
  
  const tdStyle = {
    padding: '5px 7px', // Adjust the padding for more space between columns in the body
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  };
  
  // Inside the JSX
  return (
    <div style={containerStyle}>
      <h2>Logistics</h2>
  
      {/* Logistics Table */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Shipment ID</th>
              <th style={thStyle}>Order ID</th>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Source</th>
              <th style={thStyle}>Destination</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Est. Delivery</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logistics.map((shipment) => (
              <tr key={shipment.shipment_id} style={tdStyle}>
                <td style={tdStyle}>{shipment.shipment_id}</td>
                <td style={tdStyle}>{shipment.order_id}</td>
                <td style={tdStyle}>{shipment.product_name}</td>
                <td style={tdStyle}>{shipment.quantity}</td>
                <td style={tdStyle}>{shipment.source}</td>
                <td style={tdStyle}>{shipment.destination}</td>
                <td style={tdStyle}>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    shipment.status === 'In Transit' ? 'bg-green-100 text-green-800' :
                    shipment.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                    shipment.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {shipment.status}
                  </span>
                </td>
                <td style={tdStyle}>{shipment.estimated_delivery}</td>
                <td style={tdStyle}>
                  <div style={actionContainerStyle}>
                    {/* Track Order Button */}
                    <button onClick={() => handleTrackOrder(shipment)} style={buttonStyle}>
                      Track Order
                    </button>
                    {/* Status Update Dropdown */}
                    <select
                      onChange={(e) => setNewStatus(e.target.value)}
                      value={newStatus}
                      style={selectStyle}
                    >
                      <option value="">Update Status</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <button onClick={() => handleStatusUpdate(shipment.shipment_id)} style={buttonStyle} >Save</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Map Container */}
      {selectedShipment && (
        <div id="map" style={mapStyle}></div>
      )}
    </div>
  );
  
};

// Styles for responsiveness
const containerStyle = {
  padding: '20px',
  maxWidth: '100%',
  margin: '0 auto',
};

const tableContainerStyle = {
  width: '100%',
  overflowX: 'auto', // Make table scrollable horizontally on small screens
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '900px', // Ensure table doesn't get too small on small screens
};

const actionContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
};

const buttonStyle = {
  padding: '5px 10px',
  backgroundColor: '#89ff76',
  color: 'black',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginBottom: '5px', // Space between buttons
};

const selectStyle = {
  padding: '5px',
  borderRadius: '4px',
  marginBottom: '5px', // Space between select and button
};

const mapStyle = {
  height: '400px',
  marginTop: '20px',
};

// Media queries for responsiveness
const mediaQueries = `
  @media (max-width: 768px) {
    ${tableStyle} {
      min-width: 100%;
    }
    ${actionContainerStyle} {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    ${buttonStyle} {
      margin-bottom: 10px;
      margin-left:4px;
    }
  }
`;

export default Logistics;
