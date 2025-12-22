import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 8080;
const DB = process.env.DATABASE_URI || "";

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Closing server gracefully...`);

  try {
    await mongoose.connection.close();
    console.log("✅ Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

// Connect to database with retry logic
const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(DB, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ Database Connected Successfully");
      return true;
    } catch (error) {
      console.error(
        `❌ Database connection attempt ${i + 1}/${retries} failed:`,
        error.message
      );

      if (i < retries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i), 10000); // Exponential backoff, max 10s
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  console.error("❌ Failed to connect to database after all retries");
  return false;
};

// Start server
const startServer = async () => {
  try {
    // Connect to database first
    const dbConnected = await connectDB();

    if (!dbConnected) {
      console.error(
        "❌ Server startup aborted due to database connection failure"
      );
      process.exit(1);
    }

    // Start listening only after DB is connected
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://127.0.0.1:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Graceful shutdown handlers
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught errors
    process.on("unhandledRejection", (reason, promise) => {
      console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
    });

    process.on("uncaughtException", (error) => {
      console.error("❌ Uncaught Exception:", error);
      gracefulShutdown("UNCAUGHT_EXCEPTION");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
startServer();
