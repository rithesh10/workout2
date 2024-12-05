import { Router } from "express";
const WorkoutRouter=Router();
import { verifyJWT } from "../middleware/auth.middleware.js";
import { generateWorkoutPlan, getUserWorkoutPlans ,generate,getWorkoutPlan} from "../controllers/workout.controller.js";
WorkoutRouter.route("/generate-workout").post(verifyJWT,generateWorkoutPlan)
WorkoutRouter.route("/get-user-workout-plan").post(verifyJWT,getUserWorkoutPlans)
WorkoutRouter.route("/generate").post(verifyJWT,generate)
WorkoutRouter.route("/get-workout/:userId").get(getWorkoutPlan)
export default WorkoutRouter;