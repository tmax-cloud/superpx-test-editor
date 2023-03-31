import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Editor from './Editor';
import { Observer } from 'mobx-react';
import EditorContentsStore from '../../stores/editorContentsStore';
import CustomTab from './CustomTab';
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
          </Tabs>

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
