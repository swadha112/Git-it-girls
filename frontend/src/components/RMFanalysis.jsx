import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
const RFMAnalysis = () => {
  const [rfmData, setRfmData] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRFMData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/api/analysis/rfm-segmentation"
        );
        setRfmData(response.data);
      } catch (error) {
        console.error("Error fetching RFM data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRFMData();
  }, []);

  const renderTable = (customers) => {
    if (!customers || customers.length === 0) {
      return (
        <Typography align="center" color="textSecondary">
          No data available for this category.
        </Typography>
      );
    }

    return (
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer ID</TableCell>
            <TableCell>Recency (Days)</TableCell>
            <TableCell>Frequency</TableCell>
            <TableCell>Monetary ($)</TableCell>
            <TableCell>RFM Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer, index) => (
            <TableRow key={index}>
              <TableCell>{customer.customer_id}</TableCell>
              <TableCell>{Math.round(customer.recency)}</TableCell>
              <TableCell>{customer.frequency}</TableCell>
              <TableCell>${customer.monetary.toFixed(2)}</TableCell>
              <TableCell>{customer.rfm_score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const tabs = [
    { label: "High-Risk Customers", dataKey: "highRisk" },
    { label: "Loyal Customers", dataKey: "loyal" },
    { label: "Potential Growth", dataKey: "potentialGrowth" },
    { label: "Low Frequency Low Spenders", dataKey: "lowFrequencyLowSpenders" },
  ];

  return (
    <>
      <Breadcrumb pageName="RFM Analysis" />
    <Box sx={{ padding: "20px" }}>
      
      <Tabs
        value={currentTab}
        onChange={(e, newValue) => setCurrentTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      <Box sx={{ marginTop: "20px" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          renderTable(rfmData[tabs[currentTab].dataKey] || [])
        )}
      </Box>
    </Box>
    </>
  );
};

export default RFMAnalysis;
