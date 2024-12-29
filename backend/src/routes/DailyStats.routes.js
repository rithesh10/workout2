import { Router } from "express";
import { getByDate, latest } from "../controllers/DailyStats.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const dailyRouter=Router();
dailyRouter.route("/date/:date").get(getByDate);
dailyRouter.route("/latest").get(latest);
export {dailyRouter}