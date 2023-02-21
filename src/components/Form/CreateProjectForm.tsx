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

export const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
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
    sendMessage('project', 'InsertService', {
      project: { name: projectName },
      reference: { name: 'main', type: 0 },
    });
    setOpen(false);
  };
  const [projectName, setProjectName] = React.useState('');
  const onProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Project
        <AddIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Project</DialogTitle>
        <DialogContent>
          <DialogContentText>Add Project</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={onProjectNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onClickCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

type CreateProjectFormProps = {
  open: boolean;
  setOpen: Function;
};
