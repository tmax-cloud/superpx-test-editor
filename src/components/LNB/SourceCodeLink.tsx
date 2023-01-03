import * as React from "react";
import EditorContentsStore from "../../stores/editorContentsStore";

export const SourceCodeLink: React.FC<SourceCodeLinkProps> = ({
  sourceCodeData,
}) => {
  const onSourceCodeLinkClick = () => {
    EditorContentsStore.updateContentAction(0, sourceCodeData.srcPath, sourceCodeData.content);
  };

  return (
    <div>
      <span onClick={onSourceCodeLinkClick}>{sourceCodeData.srcPath}</span>
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
