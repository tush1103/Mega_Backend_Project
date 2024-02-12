import { Router } from "express";
import { registerUser,loginUser,logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

//file handling using upload
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
//https://localhost:8000//api/v1/users/register/

router.route("/login").post(loginUser)


//securedRoutes
router.route("/logout").post(verifyJWT,logoutUser)

export default router;
