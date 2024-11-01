const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const AWS = require('aws-sdk'); // AWS SDK for accessing DynamoDB and S3
const tableName = process.env.DYNAMODB_TABLE_NAME

const app = express();

// Initialize AWS SDK (you must have AWS credentials in .env or configured globally)
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Initialize DynamoDB and S3
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Import routes
const imageRoutes = require("./routes/imageRoutes");

// Use the routes
app.use("/images", imageRoutes);

// Serve uploaded files from 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// New route to fetch image keys from DynamoDB
app.get('/images/image-keys', async (req, res) => {
  try {
    // Replace 'YourTableName' with your actual DynamoDB table name
    const params = {
      TableName: tableName
    };

    const data = await dynamoDB.scan(params).promise();

    // Assuming your table has an attribute 's3Key' for the S3 object key
    const keys = data.Items.map(item => item.s3Key);

    res.json({ keys });
  } catch (error) {
    console.error('Error fetching image keys:', error);
    res.status(500).json({ message: 'Error fetching image keys' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});