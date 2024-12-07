import express from "express"
const app=express();
import cookieParser from "cookie-parser";
import cors from "cors"
import UserRouter from'./routes/user.routes.js'
import WorkoutRouter from "./routes/workout.routes.js";
import DietRouter from "./routes/diet.routes.js";
import ExerciseRouter from "./routes/exercise.routes.js";
import FoodRouter from "./routes/FoodData.routes.js";
import weightLogRouter from "./routes/weightLog.route.js";
import performanceRouter from "./routes/performance.routes.js";
// import AdminLogin from "../../admin/src/components/AdminLogin.jsx";
import AdminRouter from "./routes/Admin.routes.js";
app.use(
    cors({
        origin: [
            'http://localhost:5174',
            'http://localhost:5173',
            'https://8a15-2409-40f0-1030-79f3-21e2-f970-5d00-1704.ngrok-free.app',
        ],
        credentials: true, // Enable sending cookies
    })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

//routes

app.use("/api/v1/user",UserRouter);
app.use("/api/v1/user",WorkoutRouter)
app.use("/api/v1/user",DietRouter);
app.use("/api/v1/user",ExerciseRouter)
app.use("/api/v1/user",FoodRouter);
app.use("/api/v1/user",weightLogRouter)
app.use("/api/v1/user",performanceRouter)
app.use("/api/v1/admin",AdminRouter);
export {app}    