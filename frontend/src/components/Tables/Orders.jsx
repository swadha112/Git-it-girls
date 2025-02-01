import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 100;

  // State for new order form
  const [newOrder, setNewOrder] = useState({
    invoice_no: "",
    customer_id: "",
    gender: "",
    age: "",
    category: "",
    quantity: "",
    price: "",
    payment_method: "",
    invoice_date: "",
    shopping_mall: "",
    product_name: "",
    review: "",
  });

  const [addingOrder, setAddingOrder] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5050/api/orders?limit=${limit}&skip=${(page - 1) * limit}`
        );
        console.log("Fetched Orders:", response.data);
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        setError("Error fetching orders");
        setLoading(false);
        console.error("Error fetching orders:", err.message);
      }
    };

    fetchOrders();
  }, [page]);

  // Handle form input change
  const handleInputChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setAddingOrder(true);
    setFormError("");

    try {
      const response = await axios.post("http://localhost:5050/api/orders/create", newOrder);
      console.log("Order Created:", response.data);
      
      // Reset form
      setNewOrder({
        invoice_no: "",
        customer_id: "",
        gender: "",
        age: "",
        category: "",
        quantity: "",
        price: "",
        payment_method: "",
        invoice_date: "",
        shopping_mall: "",
        product_name: "",
        review: "",
      });

      // Refresh orders after adding a new one
      setOrders([response.data.order, ...orders]);
    } catch (error) {
      console.error("Error creating order:", error);
      setFormError("Failed to create order. Please check your inputs.");
    } finally {
      setAddingOrder(false);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Orders</h2>

      {/* Create Order Form */}
      <div style={formContainerStyle}>
        <h3>Add New Order</h3>
        {formError && <p style={{ color: "red" }}>{formError}</p>}
        <form onSubmit={handleCreateOrder} style={formStyle}>
          <input type="text" name="invoice_no" placeholder="Invoice No" value={newOrder.invoice_no} onChange={handleInputChange} required />
          <input type="text" name="customer_id" placeholder="Customer ID" value={newOrder.customer_id} onChange={handleInputChange} required />
          <input type="text" name="gender" placeholder="Gender" value={newOrder.gender} onChange={handleInputChange} required />
          <input type="number" name="age" placeholder="Age" value={newOrder.age} onChange={handleInputChange} required />
          <input type="text" name="category" placeholder="Category" value={newOrder.category} onChange={handleInputChange} required />
          <input type="number" name="quantity" placeholder="Quantity" value={newOrder.quantity} onChange={handleInputChange} required />
          <input type="number" name="price" placeholder="Price" value={newOrder.price} onChange={handleInputChange} required />
          <input type="text" name="payment_method" placeholder="Payment Method" value={newOrder.payment_method} onChange={handleInputChange} required />
          <input type="text" name="invoice_date" placeholder="Invoice Date" value={newOrder.invoice_date} onChange={handleInputChange} required />
          <input type="text" name="shopping_mall" placeholder="Shopping Mall" value={newOrder.shopping_mall} onChange={handleInputChange} required />
          <input type="text" name="product_name" placeholder="Product Name" value={newOrder.product_name} onChange={handleInputChange} required />
          <textarea name="review" placeholder="Write a review (optional)" value={newOrder.review} onChange={handleInputChange} />
          <button type="submit" disabled={addingOrder}>{addingOrder ? "Adding..." : "Add Order"}</button>
        </form>
      </div>

      {/* Orders Table */}
      <div style={tableContainerStyle}>
        {orders.length > 0 ? (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
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
const containerStyle = { padding: "20px", maxWidth: "100%", boxSizing: "border-box", overflowX: "auto" };
const formContainerStyle = { marginBottom: "20px", padding: "15px", background: "#f9f9f9", borderRadius: "5px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "10px" };
const headerStyle = { borderBottom: "2px solid #000", padding: "10px", backgroundColor: "#f2f2f2" };
const cellStyle = { padding: "10px", borderBottom: "1px solid #ddd" };
const tableContainerStyle = { overflowX: "auto", marginTop: "20px" };
const paginationStyle = { marginTop: "20px", textAlign: "center" };

export default Orders;
