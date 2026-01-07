import app from './app.js';
import dotenv from 'dotenv';
import { connectMongoDB } from './config/db.js';
import error from './middleware/error.js';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config({
  path: 'backend/config/config.env',
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
 
});

connectMongoDB();

// Handle uncaught Exception
process.on("uncaughtException", (err) => {
     console.log(`Error: ${err.message}`);
     console.log("Shutting down the server due to uncaught Exception");
      process.exit(1);
})

// Creating server
const port = process.env.PORT || 4000;

const server = app.listen(port,()=>{
     console.log(`Server is running on port ${port}`);
})

// Handle unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close(() => {
      process.exit(1);
    });
});