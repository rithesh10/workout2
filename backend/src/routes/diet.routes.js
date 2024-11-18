import { Router } from "express";
const DietRouter=Router();
import { verifyJWT } from "../middleware/auth.middleware.js";
import { generateDietPlan } from "../controllers/diet.controller.js";
DietRouter.route("/generate-diet").post(verifyJWT,generateDietPlan)
export default DietRouter;