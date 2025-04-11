import React from "react";
import {
  Popper,
  Paper,
  Box,
  Typography,
  ClickAwayListener,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const NotificationPopup = ({ anchorEl, open, onClose }) => {
  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom-end" style={{ zIndex: 1300 }}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper elevation={3} sx={{ p: 2, minWidth: 250, zIndex: 9999 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Notifications</Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box mt={1}>
            <Typography variant="body2">• Friend request accepted</Typography>
            <Typography variant="body2">• New message from Rahul</Typography>
            <Typography variant="body2">• Your post got a like</Typography>
            {/* Replace with dynamic content later */}
          </Box>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default NotificationPopup;
