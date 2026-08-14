import express from "express";
import { getCurrentUser } from "../controllers/user.controller";
import { verifyToken } from "../middleware/authMiddleware";


const router = express.Router();

console.log("#####")
router.get("/me", verifyToken, getCurrentUser);


export default router;