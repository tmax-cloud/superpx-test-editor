import * as React from "react";
import { Editor } from "./index";
import Tab from "@mui/material/Tab";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { useObserver } from "mobx-react";
import EditorContentsStore from "../../stores/editorContentsStore";

interface CustomTabProps {
  content?: any;
  index?: number;
}

export default function CustomTab(props: CustomTabProps) {
  const { content, index } = props;
  return (
    <div>
      <Tab
        label={content.path}
        onClick={() => {
          EditorContentsStore.updateVeiwIndex(index);
        }}
      ></Tab>
      <Button
        onClick={() => {
          EditorContentsStore.deleteContentAction(content.path);
        }}
      >
        <CloseIcon />
      </Button>
    </div>
  );
}
