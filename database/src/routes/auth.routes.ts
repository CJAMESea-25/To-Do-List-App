import { Router } from "express";
import { signup, login, getMe, updateUsername, changePassword } from "../controllers/auth.controllers";
import { validateLogin, validateSignup } from "../utils/validators";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/me", requireAuth, getMe);
router.patch("/username", requireAuth, updateUsername);
router.patch("/password", requireAuth, changePassword);

export default router;