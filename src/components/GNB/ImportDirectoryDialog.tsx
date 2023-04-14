import * as React from 'react';
import EditorContentsStore from '../../stores/editorContentsStore';
import WorkspaceStore from '../../stores/workspaceStore';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export interface ImportDirectoryDialogProps {
  fullScreen: any;
  openDialog: any;
  handleCloseDialog: () => void;
}

export const ImportDirectoryDialog = ({
  fullScreen,
  openDialog,
  handleCloseDialog,
}: ImportDirectoryDialogProps) => {
  const [sourceCodes, setSourceCodes] = React.useState([]);
  const [updateInput, setUpdateInput] = React.useState(openDialog);

  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute('webkitdirectory', 'true');
    }
  }, [ref, updateInput]);

  React.useEffect(() => {
    setUpdateInput(openDialog);
  }, [openDialog]);

  const handleImportDirectory = (e) => {
    sourceCodes.forEach((sourceCode) => {
      EditorContentsStore.updateContentAction(
        sourceCode.srcPath,
        sourceCode.content,
      );
      WorkspaceStore.addSourceCodeAction(sourceCode);
    });

    handleCloseDialog();
  };

  const onFileChange = (e) => {
    const files = e.target.files;
    const tempSourceCodes = [];
    for (const file of files) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        tempSourceCodes.push({
          srcPath: `${WorkspaceStore.currentProject.name}/${file.webkitRelativePath}`,
          content: fileReader.result as string,
          newfile: true,
        });
      };
      fileReader.readAsText(file);
    }
    setSourceCodes(tempSourceCodes);
  };
  return (
    <Dialog
      fullScreen={fullScreen}
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Directory Import</DialogTitle>
      <DialogContent>
        <DialogContentText>Directory Import</DialogContentText>
        <input ref={ref} type="file" onChange={onFileChange} name="fileList" />
      </DialogContent>

      <DialogActions>
        <Button autoFocus onClick={handleCloseDialog}>
          Cancel
        </Button>
        <Button onClick={handleImportDirectory} autoFocus>
          Import Directory
        </Button>
      </DialogActions>
    </Dialog>
  );
};
