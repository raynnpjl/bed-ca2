const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const mainRoutes = require("./routes/mainRoutes");

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.use("/api", mainRoutes);

// SETUP STATIC FILES
app.use("/", express.static('front-end'));

// Run server
app.listen(port,()=> {
    console.log(`Server running on http://localhost:${port}`);
});