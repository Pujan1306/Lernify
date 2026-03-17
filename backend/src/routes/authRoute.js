import express from "express";
import { RegistrationController } from "../controller/auth/registrationController.js";
import { LoginController } from "../controller/auth/loginController.js";
import { SessionController } from "../controller/auth/sessionController.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { GoogleAuthController, GoogleCallbackController } from "../controller/auth/googleAuthController.js";
import UpdateUserProfileImage from "../controller/auth/userUpdateController.js";
import { profileUpload } from "../lib/multer.js";
import { LogoutController } from "../controller/auth/logoutController.js";
import UpdateThemeController from "../controller/auth/userUpdateThemeController.js";

const router = express.Router();

router.post("/register", RegistrationController);
router.post("/login", LoginController);
router.get("/session", protectRoute, SessionController);
router.put("/update-profile-image", protectRoute, profileUpload.single('profileImage'), UpdateUserProfileImage);
router.put("/update-theme", protectRoute, UpdateThemeController);
router.get("/google", GoogleAuthController); 
router.get("/google/callback", GoogleCallbackController);
router.post("/logout", protectRoute, LogoutController); 

export default router;