import React, { useEffect, useState } from "react";
import {
  Popper,
  Paper,
  Box,
  Typography,
  ClickAwayListener,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {  useSelector } from "react-redux";


const NotificationPopup = ({ anchorEl, open, onClose, receiverId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.token);


  useEffect(() => {
    const fetchNotifications = async () => {
      if (!receiverId || !open) return;

      try {
        setLoading(true);
     const response = await fetch(`http://localhost:3001/notifications/${receiverId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [receiverId, open]);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      style={{ zIndex: 1300 }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper elevation={3} sx={{ p: 2, minWidth: 250 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Notifications</Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box mt={1}>
            {loading ? (
              <CircularProgress size={20} />
            ) : notifications?.length > 0 ? (
              notifications.map((notif, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                  • {notif.desc}
                </Typography>
              ))
            ) : (
              <Typography variant="body2">No notifications.</Typography>
            )}
          </Box>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default NotificationPopup;
