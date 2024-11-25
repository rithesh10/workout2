import { Router } from "express";
const UserRouter=Router();
import { upload } from "../middleware/multer.middleware.js";
import { changePassword, getCurrentUser, loginUser, logout, refreshAccessToken, registerUser, updateUserDetails } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
UserRouter.route("/register").post(registerUser )
UserRouter.route("/login").post(loginUser)
UserRouter.route("/change-password").post(verifyJWT,changePassword)
UserRouter.route("/get-user").post(verifyJWT,getCurrentUser)
UserRouter.route("/logout").post(verifyJWT,logout);
UserRouter.route("/refresh-token").post(refreshAccessToken)
// UserRouter.route("/update-user-avatar").post(verifyJWT,upload.single("profilePicture"),updateProfilePic)
UserRouter.route("/change-user-details").post(verifyJWT,updateUserDetails)
export default UserRouter;