import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React from 'react';
import WorkspaceStore from '../../stores/workspaceStore';
import loadingStore from '../../stores/loadingStore';
import { sendMessage } from '../../utils/service-utils';
import { useNavigate } from 'react-router-dom';

interface CICDStandAloneModalProps {
  ciCdSelect: any;
  handleCiCdSelectClose: () => void;
  referenceId: any;
  handleChange: any;
  projectName: any;
}
export function CICDStandAloneModal(props: CICDStandAloneModalProps) {
  const {
    ciCdSelect,
    handleCiCdSelectClose,
    referenceId,
    handleChange,
    projectName,
  } = props;
  const navigate = useNavigate();

  return (
    <Dialog
      open={ciCdSelect}
      onClose={handleCiCdSelectClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'CI/CD'}</DialogTitle>
      <DialogContent sx={{ minWidth: 312 }}>
        <DialogContentText id="alert-dialog-description">
          Create Stand Alone
        </DialogContentText>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small">reference</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={referenceId}
            label="reference"
            onChange={handleChange}
          >
            {WorkspaceStore.referenceList.length &&
              WorkspaceStore.referenceList.map((workReference) => {
                return (
                  <MenuItem value={workReference.refId}>
                    <em>{workReference.name}</em>
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleCiCdSelectClose();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleCiCdSelectClose();
            sendMessage(
              'service',
              'CicdSA',
              {
                proj_name: projectName,
                ref_name: WorkspaceStore.currentReference.name,
              },
              'super-px/com.tmax.buildanddeploy',
            );
            loadingStore.setLoading(true);
            navigate(`/px/projects/${projectName}/CICDList`);
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
interface CICDMasterModalProps {
  masterModal: any;
  setMasterModal: (any) => void;
  Transition: any;
  targetIp: any;
  setTargetIp: (any) => void;
  projectName: any;
  referenceId: any;
  handleChange: any;
}
export function CICDMasterModal(props: CICDMasterModalProps) {
  const {
    masterModal,
    setMasterModal,
    Transition,
    targetIp,
    setTargetIp,
    projectName,
    referenceId,
    handleChange,
  } = props;
  const navigate = useNavigate();

  return (
    <Dialog
      open={masterModal}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => {
        setMasterModal(false);
      }}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Master</DialogTitle>
      <DialogContent>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small">reference</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={referenceId}
            label="reference"
            onChange={handleChange}
          >
            {WorkspaceStore.referenceList.length &&
              WorkspaceStore.referenceList.map((workReference) => {
                return (
                  <MenuItem value={workReference.refId}>
                    <em>{workReference.name}</em>
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <DialogContentText>Target Master SAS IP</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="Target Ip"
          label="Target Ip"
          type="text"
          fullWidth
          variant="standard"
          value={targetIp}
          onChange={(event) => {
            setTargetIp(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setMasterModal(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            setMasterModal(false);
            sendMessage(
              'service',
              'CicdMW',
              {
                proj_name: projectName,
                ref_name: WorkspaceStore.currentReference.name,
                pool_id: 'default',
                target_ip: targetIp,
              },
              'super-px/com.tmax.buildanddeploy',
            );
            loadingStore.setLoading(true);
            navigate(`/px/projects/${projectName}/CICDList`);
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
