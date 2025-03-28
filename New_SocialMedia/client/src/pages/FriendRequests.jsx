import React, { useEffect, useState } from "react";
import { Card, Typography, Avatar, Box, Grid, Button, IconButton, Divider,useMediaQuery } from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import UserWidget from "./widgets/UserWidget";

const FriendRequests = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const token = useSelector((state) => state.token);
  const { _id, picturePath } = useSelector((state) => state.user);
  useEffect(() => {
    fetchUserDetails();
    fetchFriends();
    fetchFriendRequests();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${_id}/friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${_id}/friendRequests`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setFriendRequests(data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${_id}/acceptFriend/${requestId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setFriendRequests(friendRequests.filter((req) => req._id !== requestId));
        fetchFriends();
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await fetch(`http://localhost:3001/users/${_id}/rejectFriend/${requestId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setFriendRequests(friendRequests.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box>
    <Navbar/>
    <Box
      width="100%"
      padding="2rem 6%"
      display={isNonMobileScreens ? "flex" : "block"}
      gap="0.5rem"
      justifyContent="space-between"
    >
      <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
        <UserWidget userId={_id} picturePath={picturePath} />
      </Box>
      <Box
        flexBasis={isNonMobileScreens ? "71%" : undefined}
        mt={isNonMobileScreens ? undefined : "2rem"}
      >
        <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Friends ({friends.length})</Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <Box key={friend._id} display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center">
                      <Avatar src={`http://localhost:3001/assets/${friend.picturePath}`} sx={{ mr: 2 }} />
                      <Typography>{friend.firstName} {friend.lastName}</Typography>
                    </Box>
                    <IconButton color="error">
                      <PersonRemoveIcon />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <Typography>No friends yet.</Typography>
              )}
            </Box>
          </Card>

          <Card sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">Friend Requests ({friendRequests.length})</Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
              {friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                  <Box key={request._id} display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center">
                      <Avatar src={`http://localhost:3001/assets/${request.picturePath}`} sx={{ mr: 2 }} />
                      <Typography>{request.firstName} {request.lastName}</Typography>
                    </Box>
                    <Box>
                      <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }} onClick={() => handleAcceptRequest(request._id)}>
                        Accept
                      </Button>
                      <Button variant="contained" color="secondary" size="small" onClick={() => handleRejectRequest(request._id)}>
                        Reject
                      </Button>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography>No friend requests.</Typography>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>


      </Box>
    </Box>
  </Box>




   
      

  );
};

export default FriendRequests;
