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
import { useTranslation } from 'react-i18next';

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
      src_ref_name: sourceReferenceName,
    });
    setOpen(false);
  };
  const [referenceName, setReferenceName] = React.useState('');
  const [sourceReferenceName, setSourceReferenceName] = React.useState(
    WorkspaceStore.referenceList.find((ref) => {
      return ref.name === 'main';
    })
      ? 'main'
      : '',
  );
  const [referenceType, setReferenceType] = React.useState(0);
  const onSourceReferenceNameChange = (event) => {
    setSourceReferenceName(event.target.value);
  };
  const onReferenceNameChange = (event) => {
    setReferenceName(event.target.value);
  };
  const onReferenceTypeChange = (event) => {
    setReferenceType(event.target.value);
  };
  const { t } = useTranslation();

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
              Source Reference Name
            </InputLabel>
            <Select
              value={sourceReferenceName}
              label="Reference type"
              onChange={onSourceReferenceNameChange}
            >
              {WorkspaceStore.referenceList.map((ref) => (
                <MenuItem value={ref.name}>{ref.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 300, paddingTop: '30px' }}>
            <InputLabel sx={{ minWidth: 300, paddingTop: '30px' }}>
              Reference type
            </InputLabel>
            <Select
              value={referenceType}
              label="Reference type"
              onChange={onReferenceTypeChange}
            >
              <MenuItem value={0}>{t('REFERENCETYPEBRANCH')}</MenuItem>
              <MenuItem value={1}>{t('REFERENCETYPETAG')}</MenuItem>
              <MenuItem value={2}>{t('REFERENCETYPERELEASE')}</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={onClickCreate}
            disabled={!(referenceName && sourceReferenceName)}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

type CreateReferenceFormProps = {
  open: boolean;
  setOpen: Function;
};
