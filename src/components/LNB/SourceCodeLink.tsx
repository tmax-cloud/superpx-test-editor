import * as React from "react";

export const SourceCodeLink: React.FC<SourceCodeLinkProps> = ({
  wsUrl,
  sourceCodeData,
  setEditorText,
}) => {
  const onSourceCodeLinkClick = () => {
    setEditorText(sourceCodeData.content);
  };

  return (
    <div>
      <span onClick={onSourceCodeLinkClick}>{sourceCodeData.srcPath}</span>
    </div>
  );
};

type SourceCodeLinkProps = {
  wsUrl: string;
  sourceCodeData?: {
    commitId: number;
    content: string;
    createdTime: string;
    srcHistId: number;
    srcId: number;
    srcPath: string;
  };
  setEditorText?: Function;
};
