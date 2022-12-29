import * as React from "react";
import { setRequest } from "../../utils/service-utils";
import DeleteIcon from "@mui/icons-material/Delete";

export const ProjectLink: React.FC<ProjectLinkProps> = ({
  wsUrl,
  projectData,
  setReferenceList,
  setSourceCodeList,
  deleteProjectList,
}) => {
  const onProjectLinkClick = async () => {
    const projectSocket = new WebSocket(wsUrl);
    const request = setRequest("com.tmax.service.project.DetailService", {
      proj_id: projectData.projId,
    });
    projectSocket.onopen = (event) => {
      projectSocket.send(JSON.stringify(request));
    };

    projectSocket.onmessage = (event) => {
      console.log(event.data);
      const wsdata = JSON.parse(event.data).body.data;
      alert(`Get Reference List from Project ${wsdata.name}.`);
    };
    const refernceSocket = new WebSocket(wsUrl);
    const refernceRequest = setRequest(
      "com.tmax.service.reference.ListService",
      {
        proj_id: projectData.projId,
      }
    );
    refernceSocket.onopen = (event) => {
      refernceSocket.send(JSON.stringify(refernceRequest));
    };

    refernceSocket.onmessage = (event) => {
      setReferenceList(JSON.parse(event.data).body.data);
    };

    // const sourceCodeSocket = new WebSocket(wsUrl);
    // const sourceCodeSocketRequest = setRequest(
    //   "com.tmax.service.sourceCode.ListSrcService",
    //   {
    //     projectId: projectData.projId,
    //   }
    // );
    // sourceCodeSocket.onopen = (event) => {
    //   sourceCodeSocket.send(JSON.stringify(sourceCodeSocketRequest));
    // };

    // sourceCodeSocket.onmessage = (event) => {
    //   setSourceCodeList(JSON.parse(event.data).body.data);
    // };
  };
  const onDeleteClick = () => {
    const projectSocket = new WebSocket(wsUrl);
    const request = setRequest("com.tmax.service.project.DeleteService", {
      proj_id: projectData.projId,
    });
    projectSocket.onopen = (event) => {
      projectSocket.send(JSON.stringify(request));
    };

    projectSocket.onmessage = (event) => {
      console.log(event.data);
      alert(`Delete Project List from ${projectData.name}.`);
    };
    deleteProjectList(projectData.projId);
  };

  return (
    <div>
      <span onClick={onProjectLinkClick}>{projectData.name}</span>
      <DeleteIcon onClick={onDeleteClick} />
    </div>
  );
};

type ProjectLinkProps = {
  wsUrl: string;
  projectData?: {
    projId: number;
    name: string;
  };
  setReferenceList?: Function;
  setSourceCodeList?: Function;
  deleteProjectList?: Function;
};
