import mongoose from "mongoose";
import User from "./Model/userModel.js";
import dotenv from "dotenv";
dotenv.config({path:"./config.env"});

const seedSuperAdmin = async () => {
  try {
    
    // connecting database
    const DB = process.env.DATABASE_URI || "";
    const connection = mongoose.connect(DB);
    await connection;
    console.log("✅ Connected to MongoDB");
    

    const adminEmail = process.env.SUPER_ADMIN_EMAIL;
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    // Checking exist admin
    if (existingAdmin) {
      console.log("⚠️  Super admin already exists!");
      process.exit(0);
    }

    await User.create({
      name: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("✅ Super Admin created from environment variables");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedSuperAdmin();