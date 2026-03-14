require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const SessAppRouter = require('../Projects/sample/SessRouter.cjs');


const app = express();
const port = 5000;
 
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

console.log("JWT SECRET:", process.env.JWT_SECRET);
app.use("/api", SessAppRouter);

// Default Test Route
app.get("/", (req, res) => {
  res.send("✅ Task Management Node Server Running...");
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
