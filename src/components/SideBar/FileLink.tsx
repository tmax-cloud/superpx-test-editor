import * as React from "react";
import { setRequest } from "../../utils/service-utils";

export const FileLink: React.FC<FileLinkProps> = ({
  wsUrl,
  filedata,
  setFileText,
}) => {
  const onFileLinkClick = async () => {
    const exampleSocket = new WebSocket(wsUrl);
    const request = setRequest("com.tmax.service.sourceCode.DetailSrcService", {
      srcId: filedata.id,
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
      setFileText(lineData.join(""));
    };
  };

  return <p onClick={onFileLinkClick}>{filedata.path}</p>;
};

type FileLinkProps = {
  wsUrl: string;
  filedata?: {
    id: number;
    path: string;
    projectId: number;
  };
  setFileText?: Function;
};
