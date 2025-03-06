import { Router } from "express";
const UserRouter=Router();
import { upload } from "../middleware/multer.middleware.js";
import { changePassword, getAllUsers, getCurrentUser, loginUser, logout, refreshAccessToken, registerUser, updateUserDetails,forgotPassword,resetPassword, updateUserByAdmin, deleteUserByAdmin, } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
// import { useSearch } from "../../../frontend/src/workout/navbar.jsx";
UserRouter.route("/register").post(registerUser )
UserRouter.route("/login").post(loginUser)

UserRouter.route("/change-password").post(verifyJWT,changePassword)
UserRouter.route("/get-user").get(verifyJWT,getCurrentUser)
UserRouter.route("/logout").post(verifyJWT,logout);
UserRouter.route("/refresh-token").post(refreshAccessToken)
UserRouter.route("/get-all-users").get(getAllUsers)
// UserRouter.route("/update-user-avatar").post(verifyJWT,upload.single("profilePicture"),updateProfilePic)
UserRouter.route("/change-user-details").post(verifyJWT,updateUserDetails)
UserRouter.route("/forget-password").post(forgotPassword);

UserRouter.route("/reset-password").post(verifyJWT,resetPassword);
UserRouter.route("/update").post(updateUserByAdmin);
UserRouter.route("/del").post(deleteUserByAdmin)
export default UserRouter;