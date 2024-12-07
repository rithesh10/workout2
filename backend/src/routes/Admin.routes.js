import { Router } from "express";
import { verifyAdminJWT, verifyJWT } from "../middleware/auth.middleware.js";
import { changeAdminPassword, getCurrentAdmin, loginAdmin, logoutAdmin, refreshAdminAccessToken, registerAdmin, updateAdminDetails } from "../controllers/Admin.controller.js";
const AdminRouter=Router();
AdminRouter.route("/registerAdmin").post(registerAdmin);
AdminRouter.route("/loginAdmin").post(loginAdmin)
AdminRouter.route("/getAdmin").post(verifyAdminJWT,getCurrentAdmin);
AdminRouter.route("/changePasswordAdmin").post(verifyAdminJWT,changeAdminPassword);
AdminRouter.route("/logoutAdmin").post(verifyAdminJWT,logoutAdmin);
AdminRouter.route("/refreshAdminAccessToken").post(verifyAdminJWT,refreshAdminAccessToken);
AdminRouter.route("/updateAdminDetails").post(verifyAdminJWT,updateAdminDetails);   
export default AdminRouter;
