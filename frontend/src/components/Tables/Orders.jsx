import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 100;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5050/api/orders?limit=${limit}&skip=${(page - 1) * limit}`);
        console.log('Fetched Orders:', response.data);
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        setError('Error fetching orders');
        setLoading(false);
        console.error('Error fetching orders:', err.message);
      }
    };

    fetchOrders();
  }, [page]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={containerStyle}>
      <div style={tableContainerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Orders</h2>
        {orders.length > 0 ? (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={headerStyle}>Invoice No</th>
                  <th style={headerStyle}>Customer ID</th>
                  <th style={headerStyle}>Gender</th>
                  <th style={headerStyle}>Age</th>
                  <th style={headerStyle}>Category</th>
                  <th style={headerStyle}>Quantity</th>
                  <th style={headerStyle}>Price</th>
                  <th style={headerStyle}>Payment Method</th>
                  <th style={headerStyle}>Invoice Date</th>
                  <th style={headerStyle}>Shopping Mall</th>
                  <th style={headerStyle}>Product Name</th>
                  <th style={headerStyle}>Review</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={cellStyle}>{order.invoice_no}</td>
                    <td style={cellStyle}>{order.customer_id}</td>
                    <td style={cellStyle}>{order.gender}</td>
                    <td style={cellStyle}>{order.age}</td>
                    <td style={cellStyle}>{order.category}</td>
                    <td style={cellStyle}>{order.quantity}</td>
                    <td style={cellStyle}>{order.price}</td>
                    <td style={cellStyle}>{order.payment_method}</td>
                    <td style={cellStyle}>{order.invoice_date}</td>
                    <td style={cellStyle}>{order.shopping_mall}</td>
                    <td style={cellStyle}>{order.product_name}</td>
                    <td style={cellStyle}>{order.review}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={paginationStyle}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <span> Page {page} </span>
              <button onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </>
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '20px',
  maxWidth: '100%',
  boxSizing: 'border-box',
  overflowX: 'auto',
};

const headerStyle = {
  borderBottom: '2px solid #000',
  padding: '10px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
};

const cellStyle = {
  padding: '10px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};

const tableContainerStyle = {
  overflowX: 'auto',
  marginTop: '20px',
};

const paginationStyle = {
  marginTop: '20px',
  textAlign: 'center',
};

export default Orders;
