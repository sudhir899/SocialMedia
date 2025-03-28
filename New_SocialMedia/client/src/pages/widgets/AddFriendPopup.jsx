import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddFriendPopup = ({ onConfirm }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    onConfirm();  
    handleClose();
  };

  return (
    <>
      
      {/* Dialog Popup */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Confirm Friend Request
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography>Do you want to send a friend request?</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">No</Button>
          <Button onClick={handleConfirm} color="primary" variant="contained">Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddFriendPopup;
