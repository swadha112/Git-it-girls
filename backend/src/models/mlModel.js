const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { RandomForestClassifier } = require("ml-random-forest");

// Custom SMOTE implementation
function smote(X, y) {
  const minorityClass = y.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  const maxClassCount = Math.max(...Object.values(minorityClass));
  const oversampledX = [];
  const oversampledY = [];

  Object.keys(minorityClass).forEach((classLabel) => {
    const classIndices = y
      .map((val, idx) => (val === parseInt(classLabel) ? idx : null))
      .filter((idx) => idx !== null);

    const samplesToGenerate = maxClassCount - classIndices.length;

    classIndices.forEach((idx) => {
      oversampledX.push(Array.isArray(X[idx]) ? X[idx] : [X[idx]]);
      oversampledY.push(y[idx]);
    });

    for (let i = 0; i < samplesToGenerate; i++) {
      const randomIdx = classIndices[Math.floor(Math.random() * classIndices.length)];
      const syntheticSample = Array.isArray(X[randomIdx]) ? [...X[randomIdx]] : [X[randomIdx]];
      oversampledX.push(syntheticSample);
      oversampledY.push(parseInt(classLabel));
    }
  });

  return { X: oversampledX, y: oversampledY };
}

// Load and preprocess dataset
async function loadDataset() {
  const data = await Order.find().lean();

  data.forEach((row) => {
    row.age = parseFloat(row.age);
    row.gender = row.gender.trim();
    row.product_name = row.product_name.trim();
    row.category = row.category.trim();
    row.shopping_mall = row.shopping_mall.trim();
  });

  return data;
}

// Train Model
async function trainModel(selectedFeatureNames, selectedFeatureValues) {
    const data = await loadDataset();
    console.log("Loaded dataset:", data);
  
    const genderMapping = { Male: 0, Female: 1 };
    const shoppingMallMapping = {};
    let shoppingMallCounter = 0;
  
    data.forEach((row) => {
      row.gender = genderMapping[row.gender] || 0;
  
      if (!shoppingMallMapping[row.shopping_mall]) {
        shoppingMallMapping[row.shopping_mall] = shoppingMallCounter++;
      }
      row.shopping_mall = shoppingMallMapping[row.shopping_mall];
    });
  
    console.log("Processed dataset with mappings:", { genderMapping, shoppingMallMapping });
  
    // Filter data based on selected features
    const filteredData = data.filter((row) => {
      return selectedFeatureNames.every((feature, idx) => {
        return row[feature]?.toString() === selectedFeatureValues[idx]?.toString();
      });
    });
  
    if (filteredData.length === 0) {
      console.error("No matching data found for the selected feature values.");
      throw new Error("No matching data found for the selected feature values.");
    }
  
    console.log("Filtered Data:", filteredData);
  
    const X = filteredData.map((row) =>
      selectedFeatureNames.map((feature) => row[feature])
    );
    const y = filteredData.map((row) => row.shopping_mall);
  
    console.log("Feature matrix (X):", X);
    console.log("Target vector (y):", y);
  
    const { X: XSmote, y: ySmote } = smote(X, y);
    console.log("After SMOTE - XSmote:", XSmote, "ySmote:", ySmote);
  
    const rf = new RandomForestClassifier({
      nEstimators: 100,
      maxFeatures: selectedFeatureNames.length,
    });
  
    rf.train(XSmote, ySmote);
  
    const predictions = rf.predict(XSmote);
    const accuracy =
      predictions.filter((pred, idx) => pred === ySmote[idx]).length / ySmote.length;
  
    console.log("Predictions:", predictions);
    console.log("Accuracy:", accuracy);
  
    return {
      accuracy,
      predictedMallMapping: shoppingMallMapping,
    };
  }
  

module.exports = router;
