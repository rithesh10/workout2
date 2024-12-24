import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { AddPerformance, getPerformance,getUserPerformance, workoutPerformace} from "../controllers/Performance.controller.js";
const performanceRouter=Router();
performanceRouter.route("/add-performance").post(verifyJWT,AddPerformance);
performanceRouter.route("/get-performance").post(verifyJWT,getPerformance);
performanceRouter.route("/performance/:userId").get(getUserPerformance);
performanceRouter.route("/workoutPerformance/:id").get(workoutPerformace);

export default performanceRouter;