import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Editor } from './Editor';
import { Observer } from 'mobx-react';
import EditorContentsStore from '../../stores/editorContentsStore';
import CustomTab from './CustomTab';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import '../../style.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={EditorContentsStore.viewIndex !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className="height-full"
    >
      {EditorContentsStore.viewIndex === index && (
        <Box sx={{ p: 3 }} className="height-full">
          {children}
        </Box>
      )}
    </div>
  );
}

export const Editors = () => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    EditorContentsStore.updateVeiwIndex(newValue);
  };

  const [showModal, setShowModal] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCreateModal = () => {
    EditorContentsStore.pushContentAction(inputValue, '');
    setShowModal(false);
    setInputValue('');
  };
  const handleCancelModal = () => {
    setShowModal(false);
    setInputValue('');
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  return (
    <Observer>
      {() => (
        <div className="height-full">
          <Tabs
            value={EditorContentsStore.viewIndex}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {EditorContentsStore.contents.map((content, index) => (
              <CustomTab content={content} index={index} />
            ))}
            <Button variant="outlined" onClick={handleOpenModal}>
              +
            </Button>
          </Tabs>
          <div>
            <Dialog open={showModal} onClose={handleCancelModal}>
              <DialogTitle> File name</DialogTitle>
              <DialogContent>
                <DialogContentText>Please enter a file name</DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="file name"
                  type="email"
                  fullWidth
                  variant="standard"
                  value={inputValue}
                  onChange={handleInputChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelModal}>Cancel</Button>
                <Button onClick={handleCreateModal}>Create</Button>
              </DialogActions>
            </Dialog>
          </div>

          {EditorContentsStore.contents.map((content, index) => (
            <TabPanel value={EditorContentsStore.viewIndex} index={index}>
              <Editor />
            </TabPanel>
          ))}
        </div>
      )}
    </Observer>
  );
};
