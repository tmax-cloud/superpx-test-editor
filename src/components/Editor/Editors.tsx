import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { Editor } from "./index";
import { useObserver } from "mobx-react";
import EditorContentsStore from "../../stores/editorContentsStore";

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
      hidden={EditorContentsStore.veiwIndex !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {EditorContentsStore.veiwIndex === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </div>
  );
}

export const Editors = () => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    EditorContentsStore.updateVeiwIndex(newValue);
  };

  //create Collapse button data
  const [collapseAll, setCollapseAll] = React.useState(false);
  const handleCollapseAll = (value) => setCollapseAll(value);

  //Create file action data*
  const handleFileOnClick = (file) => {
    console.log(file);
  };

  const action = {
    fileOnClick: handleFileOnClick,
  };

  //Create Decoration data*
  const treeDecorator = {
    showIcon: true,
    iconSize: 18,
    textSize: 15,
    showCollapseAll: true,
  };

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <Tabs
        value={EditorContentsStore.veiwIndex}
        onChange={handleChange}
        onClick={(event) => {
          const eventTarget = event.target as HTMLElement;
          const parentElement = eventTarget.parentElement as HTMLDivElement;
          const newValue = parentElement.getAttribute("value");
          EditorContentsStore.updateVeiwIndex(Number(newValue));
        }}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {useObserver(() =>
          EditorContentsStore.contents.map((content) => (
            <div>
              <Tab label={content.path}></Tab>
              <Button
                onClick={() => {
                  EditorContentsStore.deleteContentAction(content.path);
                }}
              >
                <CloseIcon />
              </Button>
            </div>
          ))
        )}
      </Tabs>
      {useObserver(() =>
        EditorContentsStore.contents.map((content, index) => (
          <TabPanel value={EditorContentsStore.veiwIndex} index={index}>
            <Editor language="java" contentsIndex={index} />
          </TabPanel>
        ))
      )}
    </Box>
  );
};
