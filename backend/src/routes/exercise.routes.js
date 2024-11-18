import { Router } from "express";
const ExerciseRouter=Router();
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getExerciseData } from "../controllers/Exercise.controller.js";
ExerciseRouter.route("/get-exercises").post(verifyJWT,getExerciseData);
export default ExerciseRouter;