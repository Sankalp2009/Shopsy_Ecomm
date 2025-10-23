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


// Using Middleware
app.use(cors());

// Middleware Usage
// set secure HTTP response header
app.use(helmet());

// Body-parser, parse data coming from req.body
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

// Creating limit request per timed
app.use(generalLimiter);

// prevent Parameter Pollution
app.use(hpp());

app.use('/api/v1',userRoutes);

app.use('/api/v1/Products', ProductRouter); 

// Dummy request
app.get("/", (req, res, next)=>{
  res.send("Server Started")
})

app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});


export default app;