import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const LogoutAlert = ({ open, onClose, onLogout }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
    >
      <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description">
          Are you sure you want to logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onLogout} color="primary" autoFocus>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutAlert;
