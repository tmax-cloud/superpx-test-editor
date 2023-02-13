import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import { setRequest } from '../../utils/service-utils';
import { setAlert } from '../../utils/alert-utiles';

export const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  wsUrl,
  open,
  setOpen,
  updateProjectList,
}) => {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onClickCreate = () => {
    const projectSocket = new WebSocket(wsUrl);
    const request = setRequest('project', 'InsertService', {
      project: { name: projectName },
      reference: { name: 'main', type: 0 },
    });
    projectSocket.onopen = (event) => {
      projectSocket.send(JSON.stringify(request));
    };

    projectSocket.onmessage = (event) => {
      const wsdata = JSON.parse(event.data).data;
      updateProjectList({ name: wsdata.name, projId: wsdata.projId });
      setAlert('Add Project', `Add Project to ${wsUrl}.`, 'success');
    };
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
  wsUrl: string;
  open: boolean;
  setOpen: Function;
  updateProjectList: Function;
};
