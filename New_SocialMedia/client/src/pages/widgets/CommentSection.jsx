import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Typography, Box, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import CommentCard from "./CommentCard";
import {toast} from 'sonner';

const CommentSection = ({ comments: initialComments, postId }) => {
  const [comments, setComments] = useState(initialComments); 
  const [usersData, setUsersData] = useState([]);
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const [newComment, setNewComment] = useState("");
  const { _id } = useSelector((state) => state.user);

  useEffect(() => {
  const sorted = [...initialComments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  setComments(sorted);
}, [initialComments]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = [...new Set(comments.map((c) => c.userId))];
      if (userIds.length === 0) return;

      try {
        const response = await fetch("http://localhost:3001/users/commentUsers", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds }),
        });

        const data = await response.json();
        setUsersData(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [comments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    // 1. Moderate Comment
    const textRes = await fetch("http://localhost:3001/posts/moderateComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newComment }),
    });
    
    const { status} = await textRes.json();

    if (status === "flagged") {
      toast.error("Comment contain toxic words or Hate Speech");
      return;
    }

   if(status==="allowed"){
    const tempComment = {
      userId: _id,
      commentText: newComment,
      createdAt: new Date().toISOString(), 
    };

    setComments((prev) => [tempComment, ...prev]); 
    setNewComment(""); 

    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: _id, commentText: newComment }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Comment sent Successfully!");
        setComments(data.updatedComments);
        
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  }
  };

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>

      <Box sx={{ maxHeight: 200, overflowY: "auto", mb: 2 }}>
        {comments.length > 0 ? (
          comments.map((comment, index) => <CommentCard key={index} comment={comment} usersData={usersData} />)
        ) : (
          <Typography variant="body2" color="textSecondary">
            No comments yet.
          </Typography>
        )}
      </Box>

      <form onSubmit={handleCommentSubmit}>
        <TextField
          fullWidth
          label="Write a comment..."
          variant="outlined"
          size="small"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 1, width: "100%" }}>
          Post Comment
        </Button>
      </form>
    </Card>
  );
};

export default CommentSection;
