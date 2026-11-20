
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const logRoutes = require("./routes/logRoutes");
const aiRoutes = require("./routes/aiRoutes");

console.log("AUTH ROUTES FILE LOADED");

// Create Express application
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Make Socket.IO available to API routes
app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log("SERVER RECEIVED:", req.method, req.originalUrl);
  next();
});

// Authenticate Socket.IO connections using JWT
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return next(new Error("Invalid authentication token"));
    }

    socket.user = decoded;

    next();

  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
});

// Handle authenticated Socket.IO connections
io.on("connection", (socket) => {
  const userRoom = `user_${socket.user.id}`;

  // Join the user's private room
  socket.join(userRoom);

  console.log(
    `Authenticated user ${socket.user.id} connected to Socket.IO`
  );

  socket.on("disconnect", () => {
    console.log(`User ${socket.user.id} disconnected`);
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);
console.log("AUTH ROUTES MOUNTED");

// Security log routes
app.use("/api/logs", logRoutes);
console.log("LOG ROUTES MOUNTED");

app.use("/api/ai", aiRoutes);

// Backend test route
app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend routing is working!"
  });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CyberSentinel AI Backend is running!"
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Authenticated Socket.IO server is ready!");
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
