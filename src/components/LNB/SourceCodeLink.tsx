import * as React from "react";

export const SourceCodeLink: React.FC<SourceCodeLinkProps> = ({
  sourceCodeData,
  setEditorText,
  setEditorFilePath,
}) => {
  const onSourceCodeLinkClick = () => {
    setEditorText(sourceCodeData.content);
    setEditorFilePath(sourceCodeData.srcPath);
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
  setEditorText?: Function;
  setEditorFilePath?: Function;
};
