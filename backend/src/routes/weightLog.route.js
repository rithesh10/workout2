import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { AddWeightLog, getWeightData } from "../controllers/WeightLog.controller.js";
const weightLogRouter=Router();
weightLogRouter.route("/get-weights").post(verifyJWT,getWeightData)
weightLogRouter.route("/add-weights").post(verifyJWT,AddWeightLog)
export default weightLogRouter;