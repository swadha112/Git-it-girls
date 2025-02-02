from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE

app = Flask(__name__)

# Load dataset
data = pd.read_csv('retaildata.csv')  # Replace with the path to your CSV file

# Preprocess dataset
def preprocess_data(df):
    # Encode categorical variables
    label_encoders = {}
    for column in ['gender', 'product_name', 'category', 'shopping_mall']:
        le = LabelEncoder()
        df[column] = le.fit_transform(df[column])
        label_encoders[column] = le
    return df, label_encoders

processed_data, label_encoders = preprocess_data(data)

# Extract feature matrix (X) and target variable (y)
X = processed_data[['age', 'gender', 'product_name', 'category']]
y = processed_data['shopping_mall']

# Balance dataset using SMOTE
smote = SMOTE(random_state=42)
X_smote, y_smote = smote.fit_resample(X, y)

# Train Random Forest model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_smote, y_smote)

@app.route('/api/feature-options', methods=['GET'])
def get_feature_options():
    """
    Returns available options for each feature.
    """
    options = {
        "age": sorted(data['age'].unique().tolist()),
        "gender": label_encoders['gender'].classes_.tolist(),
        "product_name": label_encoders['product_name'].classes_.tolist(),
        "category": label_encoders['category'].classes_.tolist()
    }
    return jsonify(options)

@app.route('/api/predict', methods=['POST'])
def predict_shopping_location():
    """
    Predicts the shopping mall based on selected features and values.
    """
    try:
        input_data = request.json.get('selected_features', {})
        if not input_data:
            return jsonify({"error": "No input data provided"}), 400

        # Prepare input for the model
        input_row = []
        for feature in ['age', 'gender', 'product_name', 'category']:
            value = input_data.get(feature)
            if value is None:
                input_row.append(0)  # Default value if not provided
            else:
                # Encode the value using the corresponding label encoder
                if feature in label_encoders:
                    value = label_encoders[feature].transform([value])[0]
                input_row.append(value)

        # Reshape and predict
        prediction = rf_model.predict([input_row])[0]
        predicted_mall = label_encoders['shopping_mall'].inverse_transform([prediction])[0]

        return jsonify({"shopping_mall": predicted_mall})

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": "An error occurred during prediction"}), 500


if __name__ == '__main__':
    app.run(debug=True)
