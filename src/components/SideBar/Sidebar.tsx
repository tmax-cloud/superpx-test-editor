import * as React from "react";
import { setRequest } from "../../utils/service-utils";
import { ProjectLink } from "./ProjectLink";
import { RefernceLink } from "./ReferenceLink";
import { FileLink } from "./FileLink";

export const SideBar: React.FC<SideBarProps> = ({
  wsUrl,
  setWsUrl,
  setFileText,
}) => {
  const [fileList, setFileList] = React.useState([]);
  const [projectList, setProjectList] = React.useState([]);
  const [referenceList, setReferenceList] = React.useState([]);
  React.useEffect(() => {
    const exampleSocket = new WebSocket(wsUrl);
    const request = setRequest("com.tmax.service.project.ListService", {});
    exampleSocket.onopen = (event) => {
      exampleSocket.send(JSON.stringify(request));
    };

    exampleSocket.onmessage = (event) => {
      console.log(event.data);
      const wsdata = JSON.parse(event.data).body.data;

      const tempProjectList = [];
      console.log(wsdata);
      wsdata.forEach((d) => {
        tempProjectList.push(d);
      });

      setProjectList(tempProjectList);
      setFileText(`Get Project List from ${wsUrl}.`);
    };
  }, []);

  return (
    <div className="sidebar">
      <div>
        <h3>ProjectList</h3>
        {projectList.map((projectdata) => {
          return (
            <ProjectLink
              wsUrl={wsUrl}
              projectdata={projectdata}
              setReferenceList={setReferenceList}
              setFileList={setFileList}
            />
          );
        })}
      </div>
      <div>
        <h3>ReferenceList</h3>
        {referenceList.map((filedata) => {
          return (
            <RefernceLink
              wsUrl={wsUrl}
              referencedata={filedata}
              setFileList={setFileList}
            />
          );
        })}
      </div>
      <div>
        <h3>FileList</h3>
        {fileList.map((filedata) => {
          return (
            <FileLink
              wsUrl={wsUrl}
              filedata={filedata}
              setFileText={setFileText}
            />
          );
        })}
      </div>
    </div>
  );
};

type SideBarProps = {
  wsUrl?: string;
  setWsUrl?: Function;
  setFileText?: Function;
};
