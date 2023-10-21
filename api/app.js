const express = require("express");
const app = express();

const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");

// Add JSON parsing middleware
app.use(express.json());

// Database connetion
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("error", err);
  });

app.use("/", publicRoutes);
app.use("/auth", authRoutes);
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

module.exports = app;
