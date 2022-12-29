import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { setRequest } from "../../utils/service-utils";

export const CreateReferenceForm: React.FC<CreateReferenceFormProps> = ({
  wsUrl,
  open,
  setOpen,
  selectedProject,
  updateReferenceList,
  setEditorText,
}) => {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onClickCreate = () => {
    const referenceSocket = new WebSocket(wsUrl);
    const request = setRequest("com.tmax.service.reference.InsertService", {
      reference: {
        proj_id: selectedProject.projId,
        name: referenceName,
        type: referenceType,
      },
    });
    referenceSocket.onopen = (event) => {
      referenceSocket.send(JSON.stringify(request));
    };

    referenceSocket.onmessage = (event) => {
      console.log(event.data);
      const wsdata = JSON.parse(event.data).body.data;
      updateReferenceList({
        name: wsdata.name,
        projId: wsdata.projId,
        refId: wsdata.refId,
        type: wsdata.type,
      });
      setEditorText(`Add Reference to ${selectedProject.name}(${selectedProject.projId}).`);
    };
    setOpen(false);
  };
  const [referenceName, setReferenceName] = React.useState("");
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
          <TextField
            autoFocus
            margin="dense"
            id="type"
            label="Reference type"
            type="number"
            fullWidth
            variant="standard"
            onChange={onReferenceTypeChange}
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

type CreateReferenceFormProps = {
  wsUrl: string;
  open: boolean;
  setOpen: Function;
  selectedProject: {
    name: string;
    projId: number;
  };
  updateReferenceList: Function;
  setEditorText: Function;
};
