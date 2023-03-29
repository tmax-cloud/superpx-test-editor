import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import { sendMessage } from '../../utils/service-utils';
import WorkspaceStore from '../../stores/workspaceStore';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export const CreateReferenceForm: React.FC<CreateReferenceFormProps> = ({
  open,
  setOpen,
}) => {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onClickCreate = () => {
    sendMessage('reference', 'InsertService', {
      proj_name: WorkspaceStore.currentProject.name,
      ref_name: referenceName,
      type: referenceType,
    });
    setOpen(false);
  };
  const [referenceName, setReferenceName] = React.useState('');
  const [referenceType, setReferenceType] = React.useState(0);
  const onReferenceNameChange = (event) => {
    setReferenceName(event.target.value);
  };
  const onReferenceTypeChange = (event) => {
    setReferenceType(event.target.value);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Reference
        <AddIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Reference</DialogTitle>
        <DialogContent>
          <DialogContentText>Add Reference</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Reference Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={onReferenceNameChange}
          />
          <FormControl sx={{ minWidth: 300, paddingTop: '30px' }}>
            <InputLabel sx={{ minWidth: 300, paddingTop: '30px' }}>
              Reference type
            </InputLabel>
            <Select
              value={referenceType}
              label="Reference type"
              onChange={onReferenceTypeChange}
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onClickCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

type CreateReferenceFormProps = {
  open: boolean;
  setOpen: Function;
};
