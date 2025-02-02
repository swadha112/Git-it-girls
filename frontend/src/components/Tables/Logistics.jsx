import React, { useState, useEffect } from "react";
import axios from "axios";

const PredictShoppingLocation = () => {
  const [features, setFeatures] = useState([
    { name: "age", options: [] },
    { name: "gender", options: ["Male", "Female"] },
    { name: "product_name", options: [] },
    { name: "category", options: [] },
  ]);
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [predictionResult, setPredictionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchFeatureOptions = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/orders/feature-options");
        const { product_name, category, age } = response.data;

        setFeatures((prev) =>
          prev.map((feature) => {
            if (feature.name === "product_name") {
              return { ...feature, options: product_name };
            } else if (feature.name === "category") {
              return { ...feature, options: category };
            } else if (feature.name === "age") {
              return { ...feature, options: age };
            }
            return feature;
          })
        );
      } catch (error) {
        console.error("Error fetching feature options:", error);
      }
    };

    fetchFeatureOptions();
  }, []);

  const handleFeatureChange = (featureName, value) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [featureName]: value,
    }));
    setErrorMessage(null);
  };

  const handlePredict = async () => {
    try {
      const response = await axios.post("http://localhost:5050/api/ml/predict", {
        selectedFeatures,
      });
      setPredictionResult(response.data);
    } catch (error) {
      console.error("Error predicting shopping location:", error);
      setErrorMessage("Failed to predict shopping location. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Shopping Location Predictor</h1>
      <p>Select one or more features, choose values, and predict the shopping mall location.</p>

      <div>
        {features.map((feature) => (
          <div key={feature.name} style={{ marginBottom: "20px" }}>
            <label style={{ marginRight: "10px" }}>{feature.name}:</label>
            <select
              onChange={(e) => handleFeatureChange(feature.name, e.target.value)}
              value={selectedFeatures[feature.name] || ""}
              style={{ padding: "5px", borderRadius: "5px", width: "200px" }}
            >
              <option value="">Select {feature.name}</option>
              {feature.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <button
        onClick={handlePredict}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "5px",
          background: "lightgreen",
          color: "#000",
          border: "none",
          cursor: "pointer",
        }}
      >
        Predict Location
      </button>

      {predictionResult && (
        <div style={{ marginTop: "20px", background: "#f5f5f5", padding: "20px", borderRadius: "5px" }}>
          <h2>Prediction Result</h2>
          <p>Accuracy: {predictionResult.accuracy.toFixed(2)}</p>
          <pre>{JSON.stringify(predictionResult.predictedMallMapping, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PredictShoppingLocation;
