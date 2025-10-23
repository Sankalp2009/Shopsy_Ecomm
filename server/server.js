import app from './app.js'
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({path:"./config.env"});

// connecting database
const DB = process.env.DATABASE_URI || "";
const connection = mongoose.connect(DB);

app.listen(8080, async(req, res)=>{
  try {
    await connection;
    console.log("DataBase Connected Successfully")
  } catch (error) {
    console.log(error)
  }
  
  console.log(`server is Running on http://127.0.0.1:${8080}`)
})