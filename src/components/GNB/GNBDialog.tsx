import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function GNBDialog({
  fullScreen,
  openDialog,
  handleCloseDialog,
  actionState,
}) {
  return (
    <Dialog
      fullScreen={fullScreen}
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{actionState}</DialogTitle>
      <DialogContent>
        <DialogContentText>{actionState}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCloseDialog}>
          Cancle
        </Button>
        <Button onClick={handleCloseDialog} autoFocus>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
