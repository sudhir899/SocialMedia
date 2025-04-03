import express from "express";
import {
  getUser,
  getUsersByIds,
  getUserFriends,
  addRemoveFriend,
  getFriendRequests,
  sendFriendRequest ,
  respondToFriendRequest ,
  getRecommendations,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.post("/commentUsers", verifyToken, getUsersByIds);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:id/recommend", verifyToken, getRecommendations);
router.get("/:id/requests",verifyToken,getFriendRequests);
router.post("/:id/send-request",verifyToken,sendFriendRequest );
router.post("/:id/respond-request",verifyToken,respondToFriendRequest );
/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
