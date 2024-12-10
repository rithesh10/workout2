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
// import AdminLogin from "../../admin/src/components/AdminLogin.jsx";
import AdminRouter from "./routes/Admin.routes.js";
import { User } from "./models/user.model.js";
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://e500-2401-4900-658d-9d18-b1d0-7a95-eea9-b83.ngrok-free.app",
    ],
    // origin: ['https://e500-2401-4900-658d-9d18-b1d0-7a95-eea9-b83.ngrok-free.app'],
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
//routes

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/user", WorkoutRouter);
app.use("/api/v1/user", DietRouter);
app.use("/api/v1/user", ExerciseRouter);
app.use("/api/v1/user", FoodRouter);
app.use("/api/v1/user", weightLogRouter);
app.use("/api/v1/user", performanceRouter);
app.use("/api/v1/admin", AdminRouter);

app.post("/api/v1/user/update", async (req, res) => {
  // const id = req.params.id;
  //   console.log("hi");
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(data.id, data, { new: true }); // Update and return the updated document

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("hi");
    return res.status(200).json({ message: "updated user", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed at server", err });
  }
});
app.post('/del',async(req,res)=>{
  const data=req.body;
  try{
    const user=await User.findByIdAndDelete(data.id);
    if(!user){
      res.status(404).json({"message":"user not found"});
    }
    res.status(200).json({"message":"deleted",user});

  }catch(err){
    console.log(err);
    res.status(500).json({"message":"internal server error"});
  }
})
export { app };

