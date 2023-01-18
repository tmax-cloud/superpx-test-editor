import * as React from "react";
import EditorContentsStore from "../../stores/editorContentsStore";
import { Button } from "@mui/material";

export const SourceCodeLink: React.FC<SourceCodeLinkProps> = ({
  sourceCodeData,
}) => {
  const onSourceCodeLinkClick = () => {
    EditorContentsStore.updateContentAction(
      0,
      sourceCodeData.srcPath,
      sourceCodeData.content
    );
  };

  return (
    <div style={{ paddingLeft: 15 }}>
      <Button
        size="small"
        variant="text"
        color="inherit"
        style={{ textTransform: "none" }}
        onClick={onSourceCodeLinkClick}
      >
        {sourceCodeData.srcPath}
      </Button>
    </div>
  );
};

type SourceCodeLinkProps = {
  sourceCodeData?: {
    commitId: number;
    content: string;
    createdTime: string;
    srcHistId: number;
    srcId: number;
    srcPath: string;
  };
};
