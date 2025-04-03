import React, { useEffect, useState } from "react";
import { Card, Typography, Avatar, Box, Grid, Button, IconButton, Divider,useMediaQuery } from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import UserWidget from "./widgets/UserWidget";
import WidgetWrapper from "../components/WidgetWrapper";
import { CheckCircle, Cancel } from "@mui/icons-material"; 
import FriendListWidget from "./widgets/FriendListWidget";

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
      const response = await fetch(`http://localhost:3001/users/${_id}/requests`, {
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
      const response = await fetch(`http://localhost:3001/users/${_id}/respond-request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderId: requestId, accept: true }), // Accept friend request
      });
  
      if (response.ok) {
        setFriendRequests(friendRequests.filter((req) => req._id !== requestId));
        fetchFriends(); // Refresh friends list after accepting
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };
  
  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${_id}/respond-request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderId: requestId, accept: false }), // Reject friend request
      });
  
      if (response.ok) {
        setFriendRequests(friendRequests.filter((req) => req._id !== requestId));
      }
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
        flexBasis={isNonMobileScreens ? "40%" : undefined}
        mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <WidgetWrapper>
            <Typography variant="h6">Friend Requests ({friendRequests.length})</Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ maxHeight: 375, overflowY: "auto" }}>
              {friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                  <Box key={request._id} display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center">
                      <Avatar src={`http://localhost:3001/assets/${request.picturePath}`} sx={{ mr: 2 }} />
                      <Typography>{request.firstName} {request.lastName}</Typography>
                    </Box>
                    <Box>
                      <Button variant="contained"  color="success" startIcon={<CheckCircle />} size="small" sx={{ mr: 1 }} onClick={() => handleAcceptRequest(request._id)}>
                        Accept
                      </Button>
                      <Button variant="contained" color="error" size="small"  startIcon={<Cancel />} sx={{ mr: 1 }} onClick={() => handleRejectRequest(request._id)}>
                        Reject
                      </Button>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography>No friend requests.</Typography>
              )}
            </Box>
         </WidgetWrapper> 
         </Box>
         

         <Box
        flexBasis={isNonMobileScreens ? "30%" : undefined}
        mt={isNonMobileScreens ? undefined : "2rem"}
        >
        <FriendListWidget userId={_id}  />
        </Box>
     
    </Box>
  </Box>




   
      

  );
};

export default FriendRequests;
