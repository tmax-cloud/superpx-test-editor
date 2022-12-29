import * as React from "react";
import { setRequest } from "../../utils/service-utils";
import DeleteIcon from "@mui/icons-material/Delete";

export const ProjectLink: React.FC<ProjectLinkProps> = ({
  wsUrl,
  projectData,
  setReferenceList,
  setSourceCodeList,
}) => {
  const onFileLinkClick = async () => {
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

  return (
    <div>
      <p onClick={onFileLinkClick}>{projectData.name}</p>;
      <DeleteIcon className="inline" />
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
};
