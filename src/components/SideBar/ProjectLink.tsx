import * as React from "react";
import { setRequest } from "../../utils/service-utils";

export const ProjectLink: React.FC<ProjectLinkProps> = ({
  wsUrl,
  projectdata,
  setReferenceList,
  setFileList,
}) => {
  const onFileLinkClick = async () => {
    const exampleSocket = new WebSocket(wsUrl);
    const request = setRequest("com.tmax.service.reference.ListService", {
      proj_id: projectdata.projId,
    });
    exampleSocket.onopen = (event) => {
      exampleSocket.send(JSON.stringify(request));
    };

    exampleSocket.onmessage = (event) => {
      setReferenceList(JSON.parse(event.data).body.data);
    };
  };

  return <p onClick={onFileLinkClick}>{projectdata.name}</p>;
};

type ProjectLinkProps = {
  wsUrl: string;
  projectdata?: {
    projId: number;
    name: string;
  };
  setReferenceList?: Function;
  setFileList?: Function;
};
