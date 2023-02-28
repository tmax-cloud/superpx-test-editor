import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import EditorContentsStore from '../../../stores/editorContentsStore';
import WorkspaceStore from '../../../stores/workspaceStore';
import { SourceCodeTree } from '../SourceCodeTree';

export const Explorer: React.FC = () => {
  const [newFilePath, setNewFilePath] = React.useState('');

  const onSourcePathChange = (event) => {
    setNewFilePath(event.target.value);
  };

  const onAddSourceCodeClick = () => {
    EditorContentsStore.updateContentAction(newFilePath, '');
  };

  return (
    <div className="lnb-scm">
      <div>
        <h3 className="list-title">Source Code List</h3>
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>
              {WorkspaceStore.currentReference.name
                ? WorkspaceStore.currentReference.name
                : 'Select Project, please'}
            </Typography>
          </AccordionSummary>

          {WorkspaceStore.sourceCodeList.length > 0 && (
            <>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Source Code Path"
                type="text"
                fullWidth
                variant="standard"
                onChange={onSourcePathChange}
              />
              <Button variant="outlined" onClick={onAddSourceCodeClick}>
                Add Source Code
                <AddIcon />
              </Button>
            </>
          )}
          <SourceCodeTree />
        </Accordion>
      </div>
    </div>
  );
};
