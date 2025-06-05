import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URL;
    
    if (!connectionString) {
      console.error("MONGODB_URL is not defined in environment variables");
      return;
    }
    
    console.log("Connecting to MongoDB with connection string:", 
      connectionString.replace(/:[^:]*@/, ":****@")); // Hide password in logs
    
    const connection = await mongoose.connect(connectionString);
    console.log("MongoDB connected successfully to database:", 
      connection.connection.db.databaseName);
    
    // List all collections
    const collections = await connection.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;