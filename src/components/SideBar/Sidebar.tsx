import * as React from "react";
import { setRequest } from "../../utils/service-utils";
import { FileLink } from "./FileLink";

export const SideBar: React.FC<SideBarProps> = ({
  wsUrl,
  setWsUrl,
  setFileText,
}) => {
  const [fileList, setFileList] = React.useState([]);
  const [projectId, setProjectId] = React.useState(1);
  const onChangeWsUrl = (event) => {
    setWsUrl(event.target.value);
  };
  const onChangeProjectId = (event) => {
    setProjectId(event.target.value);
  };
  const onGetProjectButtonClick = async () => {
    const exampleSocket = new WebSocket(wsUrl);
    const request = setRequest("com.tmax.service.sourceCode.ListSrcService", {
      projectId: projectId,
    });
    exampleSocket.onopen = (event) => {
      exampleSocket.send(JSON.stringify(request));
    };

    exampleSocket.onmessage = (event) => {
      console.log(event.data);
      const wsdata = JSON.parse(event.data);

      const tempFileList = [];
      console.log(wsdata);
      wsdata.forEach((d) => {
        tempFileList.push(d);
      });

      setFileList(tempFileList);
      setFileText(`Get project ${projectId} from ${wsUrl}.`);
    };
  };

  return (
    <div className="sidebar">
      Enter WS server
      <input
        onChange={onChangeWsUrl}
        placeholder="ws://localhost:8001"
        type="Text"
      ></input>
      Enter Porject ID
      <input onChange={onChangeProjectId} placeholder="1" type="Number"></input>
      <button onClick={onGetProjectButtonClick}>Get Project</button>
      {fileList.map((file) => {
        return (
          <FileLink wsUrl={wsUrl} filedata={file} setFileText={setFileText} />
        );
      })}
    </div>
  );
};

type SideBarProps = {
  wsUrl?: string;
  setWsUrl?: Function;
  setFileText?: Function;
};
