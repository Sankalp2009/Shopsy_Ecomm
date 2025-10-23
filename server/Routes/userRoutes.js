import express from "express";
import { Register, Login, refreshToken } from "../Controller/userController.js";
import { authLimit } from "../Utils/rateLimiter.js";

const router = express.Router();

// Behaves as a child Route or Sub Application they apply after /api/v1/books/ or /api/v1/books/:id

router.route("/register").post(Register);

router.route("/login").post(authLimit, Login);

router.route("/refreshToken").post(refreshToken);

export default router;
