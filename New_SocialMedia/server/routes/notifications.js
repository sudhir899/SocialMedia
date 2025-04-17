import express from "express";
import { getNotifications,createNotification } from "../controllers/notifications.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:receiverId", verifyToken,getNotifications);
router.post("/",verifyToken, createNotification);

export default router;
