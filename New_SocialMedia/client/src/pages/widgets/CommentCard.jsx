import React from "react";
import { Avatar, Card, CardContent, Typography, Box } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

const CommentCard = ({ comment, usersData }) => {
  // Find user details using userId
  const user = usersData?.find((user) => user._id === comment.userId);
  const timeAgo = comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : "Unknown time";
  const image=user?.picturePath;
  return (
    <Card sx={{ display: "flex", alignItems: "flex-start", p: 2, mb: 1, bgcolor: "background.paper", boxShadow: 2 }}>
      {/* User Avatar */}
      <Avatar 
        src={`http://localhost:3001/assets/${image}`}
        alt={user?.firstName || "User"} 
        sx={{ width: 40, height: 40, mr: 2, mt: 0.5 }} 
      />

      {/* Comment Content */}
      <CardContent sx={{ flex: 1, p: 0, overflow: "hidden" }}>
        {/* Username & Time in One Row */}
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <Typography variant="subtitle2" fontWeight="bold" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user ? `${user.firstName} ${user.lastName}` : `User ${comment.userId}`}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1, whiteSpace: "nowrap" }}>
            • {timeAgo}
          </Typography>
        </Box>

        {/* Comment Text (Handles Long Content) */}
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", mt: 0.5 }}>
          {comment.commentText}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
