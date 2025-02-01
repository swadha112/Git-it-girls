const dotenv = require("dotenv");
dotenv.config(); // Load environment variables
// const cors = require('cors');


console.log("MongoDB URI:", process.env.MONGODB_URI);

const app = require("./src/App");
//const connectDB = require("./src/config/db");
//app.use(cors());
// Connect to MongoDB
//connectDB();

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
