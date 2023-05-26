import * as React from 'react';
import WorkspaceStore from '../../stores/workspaceStore';
import FolderTreeStore from '../../stores/folderTreeStore';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ImportDirectoryDialogProps } from './ImportDirectoryDialog';
import EditorContentsStore from '../../stores/editorContentsStore';

export const ImportFileDialog = ({
  fullScreen,
  openDialog,
  handleCloseDialog,
  nodeTotalPath,
}: ImportDirectoryDialogProps) => {
  const [filePath, setFilePath] = React.useState('');
  const [sourceContent, setsourceContent] = React.useState('');
  const onFileChange = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setsourceContent(fileReader.result as string);
    };
    fileReader.readAsText(file);
    const newFilePath = nodeTotalPath + e.target.files[0].name;
    setFilePath(newFilePath);
  };
  const handleImportFile = () => {
    WorkspaceStore.addSourceCodeAction({
      srcPath: filePath,
      content: sourceContent,
      newfile: true,
    });
    FolderTreeStore.addNewFileAction(filePath);
    EditorContentsStore.updateContentAction(filePath, sourceContent);
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
