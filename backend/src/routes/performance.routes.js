import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { AddPerformance, getPerformance,getUserPerformance} from "../controllers/Performance.controller.js";
const performanceRouter=Router();
performanceRouter.route("/add-performance").post(verifyJWT,AddPerformance);
performanceRouter.route("/get-performance").post(verifyJWT,getPerformance);
performanceRouter.route("/performace/:userId").get(getUserPerformance);
export default performanceRouter;