import * as React from 'react';
import WorkspaceStore from '../../stores/workspaceStore';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { ImportDirectoryDialogProps } from './ImportDirectoryDialog';

export const ImportFileDialog = ({
  fullScreen,
  openDialog,
  handleCloseDialog,
}: ImportDirectoryDialogProps) => {
  const [filePath, setFilePath] = React.useState('');
  const [sourceContent, setsourceContent] = React.useState('');
  const onChangeFilePath = (e) => {
    setFilePath(`${WorkspaceStore.currentProject.name}/${e.target.value}`);
  };
  const onFileChange = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setsourceContent(fileReader.result as string);
    };
    fileReader.readAsText(file);
  };
  const handleImportFile = (e) => {
    WorkspaceStore.addSourceCodeAction({
      srcPath: filePath,
      content: sourceContent,
      newfile: true,
    });
    handleCloseDialog();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">File Import</DialogTitle>
      <DialogContent>
        <DialogContentText>File Import</DialogContentText>
        <TextField
          margin="dense"
          id="file path"
          label="File Path"
          type="text"
          fullWidth
          variant="standard"
          onChange={onChangeFilePath}
        />
        <input type="file" onChange={onFileChange} name="file" />
      </DialogContent>

      <DialogActions>
        <Button autoFocus onClick={handleCloseDialog}>
          Cancel
        </Button>
        <Button onClick={handleImportFile} autoFocus>
          Import File
        </Button>
      </DialogActions>
    </Dialog>
  );
};
