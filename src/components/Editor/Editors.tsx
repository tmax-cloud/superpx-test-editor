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
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const Editors = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
        value={value}
        onChange={handleChange}
        onClick={(event) => {
          const eventTarget = event.target as HTMLElement;
          const parentElement = eventTarget.parentElement as HTMLDivElement;
          const newValue = parentElement.getAttribute("value");
          setValue(Number(newValue));
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
          <TabPanel value={value} index={index}>
            <Editor language="java" contentsIndex={index} value={value} />
          </TabPanel>
        ))
      )}
    </Box>
  );
};
