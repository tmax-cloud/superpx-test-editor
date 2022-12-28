import * as React from "react";
import { setRequest } from "../../utils/service-utils";

export const SourceCodeLink: React.FC<SourceCodeLinkProps> = ({
  wsUrl,
  sourceCodeData,
  setEditorText,
}) => {
  const onFileLinkClick = async () => {
    const exampleSocket = new WebSocket(wsUrl);
    const request = setRequest("com.tmax.service.sourceCode.DetailSrcService", {
      srcId: sourceCodeData.id,
    });
    exampleSocket.onopen = (event) => {
      exampleSocket.send(JSON.stringify(request));
    };

    exampleSocket.onmessage = (event) => {
      console.log(event.data);
      const wsdata = JSON.parse(event.data);
      const lineData = [];
      wsdata.body.data.forEach((d) => {
        lineData.push(d.content);
      });
      setEditorText(lineData.join(""));
    };
  };

  return <p onClick={onFileLinkClick}>{sourceCodeData.path}</p>;
};

type SourceCodeLinkProps = {
  wsUrl: string;
  sourceCodeData?: {
    id: number;
    path: string;
    projectId: number;
  };
  setEditorText?: Function;
};
