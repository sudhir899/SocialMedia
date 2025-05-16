import express from "express";
import { getFeedPosts, getUserPosts, likePost,addComment } from "../controllers/posts.js";
import {moderateComment, moderateText} from "../controllers/moderation.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.post("/:postId/comment",verifyToken,addComment);

router.post("/moderateText",verifyToken, moderateText);
router.post("/moderateComment",verifyToken, moderateComment);
export default router;
