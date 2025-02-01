import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [shipmentPort, setShipmentPort] = useState('');

  const location = useLocation();
  const { productName } = location.state || {};  // Get productName from Inventory page

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('https://supplychain-hyeo-apurvas-projects-a5f1cbec.vercel.app/api/suppliers');
        setSuppliers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching suppliers');
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://supplychain-hyeo-apurvas-projects-a5f1cbec.vercel.app/api/send-email', {
        supplierEmail: selectedSupplier.email,
        productName,
        quantity,
        shipmentPort,
      });
      alert(`Email sent to ${selectedSupplier.name} for product ${productName}`);
      setQuantity('');
      setShipmentPort('');
      setShowForm(false);
    } catch (err) {
      setError('Error sending email');
    }
  };

  if (loading) return <p>Loading suppliers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={containerStyle}>
      {productName && (
        <div className="popup-message" style={popupMessageStyle}>
          <p>Choose your supplier to reorder {productName}</p>
        </div>
      )}

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Supplier ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Performance</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>{supplier.supplier_id}</td>
                <td>{supplier.name}</td>
                <td>{supplier.category}</td>
                <td>{supplier.performance}</td>
                <td>{supplier.email}</td>
                <td>
                  <button 
                    onClick={() => { setSelectedSupplier(supplier); setShowForm(true); }}
                    style={buttonStyle}
                  >
                    Send Email
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <form onSubmit={handleSendEmail} style={formStyle}>
          <h3 style={formTitleStyle}>Send Email to {selectedSupplier.name}</h3>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Product Name: </label>
            <input type="text" value={productName} disabled style={inputStyle} />
          </div>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Quantity: </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Shipment Plant: </label>
            <select
              value={shipmentPort}
              onChange={(e) => setShipmentPort(e.target.value)}
              required
              style={inputStyle}
            >
              <option value="">Select a shipment port</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
              <option value="Houston">Houston</option>
              <option value="Phoenix">Phoenix</option>
            </select>
          </div>
          <button type="submit" style={submitButtonStyle}>Send Email</button>
        </form>
      )}
    </div>
  );
};

// Responsive styles
const containerStyle = {
  padding: '20px',
};

const popupMessageStyle = {
  marginBottom: '20px',
  color: 'green',
  fontWeight: 'bold',
};

const tableContainerStyle = {
  width: '100%',
  overflowX: 'auto',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '600px',
};

const buttonStyle = {
  padding: '5px 10px',
  backgroundColor: '#89ff76',
  color: 'black',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

// Styles for the form
const formStyle = {
  marginTop: '20px',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  border: '1px solid #ddd',
  maxWidth: '100%',
};

const formTitleStyle = {
  marginBottom: '20px',
  fontSize: '18px',
  fontWeight: 'bold',
};

const inputContainerStyle = {
  marginBottom: '15px',
};

const labelStyle = {
  display: 'inline-block',
  width: '100%',
  maxWidth: '150px',
  fontWeight: 'bold',
};

const inputStyle = {
  padding: '8px',
  width: '100%',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const submitButtonStyle = {
  padding: '10px 15px',
  backgroundColor: '#89ff76',
  color: 'black',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

// Media queries for responsiveness
const mediaQueries = `
  @media (max-width: 768px) {
    ${tableStyle} {
      min-width: 100%;
    }
    ${labelStyle} {
      width: 100%;
      margin-bottom: 5px;
    }
    ${inputContainerStyle} {
      display: flex;
      flex-direction: column;
    }
  }
`;

export default Suppliers;
