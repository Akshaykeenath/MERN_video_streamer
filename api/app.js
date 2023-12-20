const express = require("express");
const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");
const privateRoutes = require("./routes/private");
const mongoose = require("mongoose");
const cors = require("cors");
const { verifyToken, generateToken } = require("./functions/encrypt");
const { getUserDetails } = require("./functions/userManagement/userDetails");

const app = express();

//  middlewares
const corsOptions = {
  origin: process.env.APP_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(async (req, res, next) => {
  console.log(`Received a ${req.method} request at ${req.url}`);
  const token = req.headers.authorization;
  const response = verifyToken(token);
  const current_time = Math.floor(Date.now() / 1000);
  if (response.iat && response.exp) {
    if (response.exp - current_time < (response.exp - response.iat) / 4) {
      const rememberMe = response.rememberMe;
      const user = await getUserDetails(token);
      const newToken = generateToken(user, rememberMe);
      res.setHeader("Authorization", newToken);
    }
  }
  next(); // Continue processing the request
});

// Database connetion
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("error connecting to database", err);
  });

//  routes
app.use("/", publicRoutes);
app.use("/auth", authRoutes);

// Authentication middleware for private routes
async function isAuthenticated(req, res, next) {
  const token = req.headers.authorization;
  const response = verifyToken(token);
  if (!response.error) {
    // User is authenticated
    next();
  } else {
    // User is not authenticated
    const route = req.headers.frontendurl;
    res.status(401).json({ message: "unauthorized", route: route });
  }
}

app.use("/private", isAuthenticated, privateRoutes);

// error handeling
app.use((req, res, next) => {
  const error = new Error("Route not found");
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
