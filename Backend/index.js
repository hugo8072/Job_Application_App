import express from 'express';  
import pkg from 'body-parser';  
const { json } = pkg;  // Destructuring 'json' from body-parser. necessary as we imported with import instead of require
import dotenv from 'dotenv';  
import './db.js';  

// Load environment variables from the .env file
dotenv.config();

// Creating the express instance
const app = express();  

// Using the 'PORT' environment variable from the .env file (or 8000 as default)
const PORT = 8000; //CHANGE THIS TO ENV IN THE FUTURE.

// Middleware for JSON parsing
app.use(json());

// Using the user routes
import userRoutes from './routes/userRoutes.js'; // Correct path
import taskRoutes from './routes/taskRoutes.js'; // Correct path

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Job application API is working!' });
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});