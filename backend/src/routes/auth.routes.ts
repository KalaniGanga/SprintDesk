import { Router } from "express";
import {
  register,
  login
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "You are authenticated",
      user: (req as any).user
    });
  }
);

export default router;