import connectDB from "./db/db.js";
import dotenv from "dotenv"
// import express from "express"
// const app=express();
import { app } from "./app.js";
import { startCronJobs } from "./config/cronJobs.js";
dotenv.config({
    path:'./env'
})
startCronJobs();
connectDB().then(()=>{
    app.listen(process.env.PORT||4000,console.log(`Server is running on ${process.env.PORT}`))
}).catch((err)=>{
    console.log("MONGODB error",err);
});
