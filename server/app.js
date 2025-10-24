// import express from 'express'
// import cors from 'cors'
// import helmet from "helmet";
// import hpp from 'hpp';
// import cookieParser from 'cookie-parser';
// import { generalLimiter } from './Utils/rateLimiter.js'
// import userRoutes from "./Routes/userRoutes.js"
// import ProductRouter from './Routes/productRoutes.js'

// // Create Express server
// const app = express();

// app.set("trust proxy", 1); // ✅ Required for correct IP detection


// // Using Middleware
// app.use(cors({
//   origin: ["https://shopsy-ecomm-eight.vercel.app/"], // your deployed frontend
//   methods: ["GET", "POST", "PUT", "PATCH",  "DELETE"],
//   credentials: true,
// }));

// // Middleware Usage
// // set secure HTTP response header
// app.use(helmet());

// // Body-parser, parse data coming from req.body
// app.use(express.json());

// // Cookie parser middleware
// app.use(cookieParser());

// // Creating limit request per timed
// app.use(generalLimiter);

// // prevent Parameter Pollution
// app.use(hpp());

// app.use('/api/v1',userRoutes);

// app.use('/api/v1/Products', ProductRouter); 

// // Dummy request
// app.get("/", (req, res, next)=>{
//   res.send("Server Started")
// })

// app.use((req, res, next) => {
//   res.set('Cache-Control', 'public, max-age=3600');
//   next();
// });


// export default app;

import express from 'express'
import cors from 'cors'
import helmet from "helmet";
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { generalLimiter } from './Utils/rateLimiter.js'
import userRoutes from "./Routes/userRoutes.js"
import ProductRouter from './Routes/productRoutes.js'

// Create Express server
const app = express();

app.set("trust proxy", 1); // ✅ Required for correct IP detection

// FIXED: Proper CORS configuration without trailing slash
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? "https://shopsy-ecomm-eight.vercel.app"  // No trailing slash, no array
    : "http://localhost:5173", // for local development
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200
}));


// Middleware Usage
// set secure HTTP response header
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Body-parser, parse data coming from req.body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser middleware
app.use(cookieParser());

// Creating limit request per timed
app.use(generalLimiter);

// prevent Parameter Pollution
app.use(hpp());

// Cache control for static responses
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache
  }
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1', userRoutes);
app.use('/api/v1/Products', ProductRouter); 

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "ShopNexus API Server", 
    version: "1.0.0",
    status: "running" 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal server error"
  });
});

export default app;