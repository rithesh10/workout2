import { Router } from "express";
const WorkoutRouter=Router();
import { verifyJWT } from "../middleware/auth.middleware.js";
import { generateWorkoutPlan, getUserWorkoutPlans } from "../controllers/workout.controller.js";
WorkoutRouter.route("/generate-workout").post(verifyJWT,generateWorkoutPlan)
WorkoutRouter.route("/get-user-workout-plan").post(verifyJWT,getUserWorkoutPlans)
export default WorkoutRouter;