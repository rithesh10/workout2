import { Router } from "express";
const ExerciseRouter=Router();
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getExerciseData, updateExerciseData } from "../controllers/Exercise.controller.js";
ExerciseRouter.route("/get-exercises").get(getExerciseData);
ExerciseRouter.route("/updateExercise/:id").put(updateExerciseData)
export default ExerciseRouter;