import { Router } from "express";
const FoodRouter=Router();
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { generateFoodData } from "../controllers/FoodData.controller.js";
FoodRouter.route("/get-food-data").post(verifyJWT,upload.single("FoodPicture"),generateFoodData)
export default FoodRouter