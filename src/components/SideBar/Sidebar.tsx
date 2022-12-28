import * as React from "react";
import { setRequest } from "../../utils/service-utils";
import { ProjectLink } from "./ProjectLink";
import { RefernceLink } from "./ReferenceLink";
import { SourceCodeLink } from "./SourceCodeLink";

export const SideBar: React.FC<SideBarProps> = ({
  wsUrl,
  setEditorText,
}) => {
  const [projectList, setProjectList] = React.useState([]);
  const [showProjectList, setShowProjectList] = React.useState(true);  
  const [referenceList, setReferenceList] = React.useState([]);
  const [showReferenceList, setShowReferenceList] = React.useState(false);
  const [sourceCodeList, setSourceCodeList] = React.useState([]);
  const [showOpenSouceCodeList, setShowOpenSouceCodeList] = React.useState(false);
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
      setEditorText(`Get Project List from ${wsUrl}.`);
    };
  }, []);

  return (
    <div className="sidebar">
      <div>
        <h3>ProjectList</h3>
        <button onClick={()=>{setShowProjectList(!showProjectList)}}>{showProjectList ? '접기' : '열기'}</button>
        {showProjectList && projectList.map((projectdata) => {
          return (
            <ProjectLink
              wsUrl={wsUrl}
              projectData={projectdata}
              setReferenceList={setReferenceList}
              setSourceCodeList={setSourceCodeList}
            />
          );
        })}
      </div>
      <div>
        <h3>ReferenceList</h3>
        <button onClick={()=>{setShowReferenceList(!showReferenceList)}}>{showReferenceList ? '접기' : '열기'}</button>
        {showReferenceList && referenceList.map((filedata) => {
          return (
            <RefernceLink
              wsUrl={wsUrl}
              referenceData={filedata}
              setSourceCodeList={setSourceCodeList}
            />
          );
        })}
      </div>
      <div>
        <h3>SourceCodeList</h3>
        <button onClick={()=>{setShowOpenSouceCodeList(!showOpenSouceCodeList)}}>{showOpenSouceCodeList ? '접기' : '열기'}</button>
        {showOpenSouceCodeList && sourceCodeList.map((filedata) => {
          return (
            <SourceCodeLink
              wsUrl={wsUrl}
              sourceCodeData={filedata}
              setEditorText={setEditorText}
            />
          );
        })}
      </div>
    </div>
  );
};

type SideBarProps = {
  wsUrl?: string;
  setEditorText?: Function;
};
