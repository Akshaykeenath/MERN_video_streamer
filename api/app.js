const express = require("express");
const app = express();

const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");

// Add JSON parsing middleware
app.use(express.json());

app.use("/", publicRoutes);
app.use("/auth", authRoutes);

module.exports = app;
