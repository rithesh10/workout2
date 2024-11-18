import { db_name } from "../constant.js";
import mongoose from "mongoose";
import express from "express"
// const app=express();
const connectDB= (async()=>{
    try {
        // console.log(process.env.MONGODB_URI)
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)
        console.log(`Mongodb connected !! DB connexted:${connectionInstance.connection.host}`)
      
    } catch (error) {
        console.log("Mongodb connection error",error)
       process.exit(1);
    }
})
export default connectDB;