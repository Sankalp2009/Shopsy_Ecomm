import User from "../Model/userModel.js";
import { createSendToken } from "../Utils/jwt.js"
import bcrypt from "bcryptjs"
import dotenv from "dotenv";
dotenv.config();

const SUPER_ADMIN = {
  email: process.env.SUPER_ADMIN_EMAIL,
  password: process.env.SUPER_ADMIN_PASSWORD,
  name: process.env.SUPER_ADMIN_NAME,
};
// Auth Routes
// REGISTER USER
export const Register = async(req, res)=>{
   try {
    const { name, email, password, photo } = req.body;
    console.log("📝 Register attempt:", { name, email,  photo, password: password ? "***" : "missing" });

    // Check if all required fields are provided
    if (!name || !email || !password || !photo) {
      return res.status(400).json({
        status: "Fail",
        message: "Please provide all required fields: name, email,  password, photo"
      });
    }
    
    // ✅ SECURITY: Block admin role registration
    // Only allow registering as regular user
    if (email.toLowerCase() === SUPER_ADMIN.email.toLowerCase()) {
      return res.status(400).json({
        status: "fail",
        message: "This email is reserved. Please use a different email.",
      });
    }


    // Check for existing user
    const ExistUser = await User.findOne({ email });
    console.log("🔍 Existing user check:", ExistUser ? "User exists" : "No user found");
    
    if (ExistUser) {
      return res.status(400).json({
        status: "Fail",
        message: "User already exists",
      });
    }

    console.log("✅ Creating new user...");
    // ✅ Create user with FORCED role as "user"
    // Ignore any role sent in request body
    const newUser = await User.create({
      name,
      email,
      role: "user",
      photo: photo || "",
      password: password,
    });

    console.log("✅ User created:", { id: newUser._id, email: newUser.email });
    
    // Call createSendToken
    console.log("🔑 Calling createSendToken...");
    createSendToken(newUser, 201, res, "User registered successfully");


  } catch (error) {
    console.error("❌ Register error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        status: "Fail",
        message: "Email already exists",
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: "Fail",
        message: "Validation failed",
        errors: errors
      });
    }

    return res.status(500).json({
      status: "Fail",
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}


// LOGIN
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide valid email and password.",
      });
    }
    
    // Step 2: Find user and include password
    const user = await User.findOne({ email }).select("+password");

    // Step 3: Verify user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    // Step 4: Remove password from output
    user.password = undefined;

    // Step 5: Send token and user data
    createSendToken(user, 200, res, "Login successful");
    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message || "Error logging in",
    });
  }
};


export const refreshToken = async (req, res) => {
  try {
    let token;

    // Get token from header or cookie
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in",
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User no longer exists",
      });
    }

    // Generate new token automatically
     createSendToken(user,200,res);
     
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }
}