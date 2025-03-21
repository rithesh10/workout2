import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./routes/user.routes.js";
import WorkoutRouter from "./routes/workout.routes.js";
import DietRouter from "./routes/diet.routes.js";
import ExerciseRouter from "./routes/exercise.routes.js";
import FoodRouter from "./routes/FoodData.routes.js";
import weightLogRouter from "./routes/weightLog.route.js";
import performanceRouter from "./routes/performance.routes.js";
import PerformanceModel from "./models/Performance.model.js";
// import AdminLogin from "../../admin/src/components/AdminLogin.jsx";
import AdminRouter from "./routes/Admin.routes.js";
import { dailyRouter } from "./routes/DailyStats.routes.js";
app.use(
  cors({
    origin: [
      // "http://localhost:5174",
      "http://192.168.1.14:5173",
      // "https://e500-2401-4900-658d-9d18-b1d0-7a95-eea9-b83.ngrok-free.app",
      // "*"
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/user", WorkoutRouter);
app.use("/api/v1/user", DietRouter);
app.use("/api/v1/user", ExerciseRouter);
app.use("/api/v1/user", FoodRouter);
app.use("/api/v1/user", weightLogRouter);
app.use("/api/v1/user", performanceRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/user",dailyRouter);
app.get("/",(req,res)=>{
  res.send("Hello");
})


// app.get('/perform/:id',async(req,res)=>{
//   const id=req.params.id;
//   try {
//     const users=await PerformanceModel.find({user:id});
//     if(!users){
//       return res.status(404).json({"message":"users not found"});
//     }
//     return res.status(200).json({"message":"users",users});
    
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({"message":error});
//   }
// });

// app.get('/perform',async(req,res)=>{
//   // const id=req.params.id;
//   try {
//     const users=await PerformanceModel.find();
//     if(!users){
//       return res.status(404).json({"message":"users not found"});
//     }
//     return res.status(200).json({"message":users});
    
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({"message":error});
//   }
// });
export { app };