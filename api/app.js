const express = require("express");
const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");
const privateRoutes = require("./routes/private");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const { verifyToken } = require("./functions/encrypt");

const store = new session.MemoryStore();

const app = express();

//  middlewares
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    cookie: { maxAge: 30000 },
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

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
function isAuthenticated(req, res, next) {
  const token = req.headers.authorization;
  const response = verifyToken(token);
  if (!response.error) {
    // User is authenticated
    next();
  } else {
    // User is not authenticated
    res.status(401).json({ message: "Unauthorized" });
  }
}

app.use("/private", isAuthenticated, privateRoutes);

// error handeling
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
