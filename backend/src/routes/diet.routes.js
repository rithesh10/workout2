import { Router } from "express";
const DietRouter=Router();
import { verifyJWT } from "../middleware/auth.middleware.js";
import { generateDietPlan, getUserDietPlans,getDietPlan } from "../controllers/diet.controller.js";
DietRouter.route("/generate-diet").post(verifyJWT,generateDietPlan)
DietRouter.route("/get-diet").post(verifyJWT,getUserDietPlans);
DietRouter.route("/get-diet/:userId").get(getDietPlan);
export default DietRouter;