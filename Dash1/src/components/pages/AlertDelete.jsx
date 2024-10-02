import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({ open, onClose, onDelete }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Confirm Delete
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This employee will be removed permanently. Do you really want to remove?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button
          onClick={() => {
            onDelete();
            onClose();
          }}
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
