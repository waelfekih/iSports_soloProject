import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router()

// Register route
router.route("/register" )
    .post(userController.register)

// Login route
router.route("/login")
    .post(userController.login)

export default router;



