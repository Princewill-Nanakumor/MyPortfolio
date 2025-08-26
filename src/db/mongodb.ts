// src/db/mongodb.ts
import mongoose, { Connection, Mongoose } from "mongoose";

// Cached connection object
interface CachedConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cachedConnection: CachedConnection = {
  conn: null,
  promise: null,
};

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn(
    "MONGODB_URI environment variable is not defined - using fallback mode"
  );
}

// Ensure we're connecting to the correct database
const MONGODB_URI_WITH_DB: string | null = MONGODB_URI
  ? MONGODB_URI.replace(/\/$/, "") + "/blog_portfolio"
  : null;

const options: mongoose.ConnectOptions = {
  bufferCommands: true,
  autoIndex: true,
  maxPoolSize: 50,
  minPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4,
  retryWrites: true,
  connectTimeoutMS: 30000,
  dbName: "blog_portfolio", // Explicitly set the database name
};

let listenersSet: boolean = false;

function isConnectionUsable(): boolean {
  return (
    mongoose.connection.readyState === 1 && mongoose.connection.db !== undefined
  );
}

// Function to ensure models are registered
function ensureModelsRegistered(): void {
  try {
    // Import and register all models here
    // This ensures they're available before any queries
    require("@/models/blogPost");
    // Import any other models you need
    // require("@/models/User");
    // require("@/models/Activity");

    console.log("Models registered successfully");
  } catch (error) {
    console.error("Error registering models:", error);
  }
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes("ETIMEOUT")) {
      return "Database connection timed out. Please check your network connection and try again.";
    }
    if (error.message.includes("Authentication failed")) {
      return "Database authentication failed. Please check your credentials.";
    }
    if (error.message.includes("ECONNREFUSED")) {
      return "Could not connect to database. Please check if the database server is running.";
    }
    return error.message;
  }
  return "An unexpected error occurred while connecting to the database.";
};

const handleShutdown = async (signal: string): Promise<void> => {
  try {
    await disconnectMongoDB();
    console.log(`MongoDB connection closed through ${signal}`);
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

export const disconnectMongoDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) return;
  try {
    await mongoose.connection.close();
    cachedConnection.conn = null;
    cachedConnection.promise = null;
    console.log("MongoDB disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    throw error;
  }
};

export const withDatabase = async <T>(
  operation: () => Promise<T>,
  retries: number = 3
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await connectMongoDB();
      return await operation();
    } catch (err) {
      lastError = err;
      console.error(
        `Database operation error (attempt ${attempt}/${retries}):`,
        err
      );

      if (attempt === retries) break;

      const backoffTime = Math.min(1000 * Math.pow(2, attempt), 10000);
      await new Promise((resolve) => setTimeout(resolve, backoffTime));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Unknown database error");
};

export const executeDbOperation = async <T>(
  operation: () => Promise<T>,
  errorMessage: string = "Database operation failed"
): Promise<T> => {
  try {
    await connectMongoDB();
    return await operation();
  } catch (error) {
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
};

const connectMongoDB = async (retries: number = 2): Promise<boolean> => {
  try {
    // Ensure models are registered BEFORE connecting
    ensureModelsRegistered();

    if (isConnectionUsable()) {
      console.log("MongoDB already connected");
      return true;
    }

    if (!MONGODB_URI) {
      console.warn(
        "MONGODB_URI environment variable is not defined - using fallback mode"
      );
      return false;
    }

    if (cachedConnection.promise) {
      await cachedConnection.promise;
      return true;
    }

    if (!listenersSet) {
      mongoose.connection.on("connected", () => {
        console.log("MongoDB connection established");
      });

      mongoose.connection.on("error", (err: Error) => {
        console.error("MongoDB connection error:", err);
        cachedConnection.conn = null;
        cachedConnection.promise = null;
      });

      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected");
        cachedConnection.conn = null;
        cachedConnection.promise = null;
      });

      process.on("SIGTERM", () => handleShutdown("SIGTERM"));
      process.on("SIGINT", () => handleShutdown("SIGINT"));

      listenersSet = true;
    }

    cachedConnection.promise = mongoose
      .connect(MONGODB_URI_WITH_DB!, options)
      .then((mongooseInstance: Mongoose) => {
        console.log("MongoDB connected successfully to blog_portfolio");
        cachedConnection.conn = mongooseInstance;
        return mongooseInstance;
      })
      .catch(async (error: Error) => {
        console.error("Initial connection error:", error);
        cachedConnection.promise = null;
        throw error;
      });

    await cachedConnection.promise;
    return true;
  } catch (error) {
    console.error(
      `MongoDB connection attempt failed (${retries} retries left):`,
      error instanceof Error ? error.message : "Unknown error"
    );

    if (retries > 0) {
      console.log(`Retrying connection in 2 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return connectMongoDB(retries - 1);
    }

    console.error(
      "MongoDB connection failed after all retries - using fallback mode"
    );
    cachedConnection.conn = null;
    cachedConnection.promise = null;
    return false;
  }
};

export default connectMongoDB;
