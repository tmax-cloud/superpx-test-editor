import * as React from "react";
import { setRequest } from "../../utils/service-utils";
import DeleteIcon from "@mui/icons-material/Delete";
import { setAlert } from "../../utils/alert-utiles";

export const ProjectLink: React.FC<ProjectLinkProps> = ({
  wsUrl,
  projectData,
  setReferenceList,
  setSourceCodeList,
  deleteProjectList,
  setSelectedProject,
  setSelectedReference,
  setCommitList,
}) => {
  const onProjectLinkClick = async () => {
    setSelectedProject(projectData);
    const projectSocket = new WebSocket(wsUrl);
    const request = setRequest("com.tmax.service.project.DetailService", {
      proj_id: projectData.projId,
    });
    projectSocket.onopen = (event) => {
      projectSocket.send(JSON.stringify(request));
    };

    projectSocket.onmessage = (event) => {
      const wsdata = JSON.parse(event.data).body.data;
      setAlert(
        "Get Reference",
        `Get Reference List from Project ${wsdata.name}.`,
        "success"
      );
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
      const referenceList = JSON.parse(event.data).body.data;
      setReferenceList(referenceList);
      const mainReference =
        referenceList.filter((r) => r.name == "main")[0] || referenceList[0];
      setSelectedReference(mainReference);
      const commitSocket = new WebSocket(wsUrl);
      const commitSocketRequest = setRequest(
        "com.tmax.service.commit.ListService",
        {
          ref_id: mainReference.refId,
        }
      );
      commitSocket.onopen = (event) => {
        commitSocket.send(JSON.stringify(commitSocketRequest));
      };

      commitSocket.onmessage = (event) => {
        if (JSON.parse(event.data).body.data) {
          setCommitList(JSON.parse(event.data).body.data);
        }
        const commitId = JSON.parse(event.data).body.data
          ? JSON.parse(event.data).body.data[0].commitId
          : null;
        if (commitId) {
          const commitSocket = new WebSocket(wsUrl);
          const commitSocketRequest = setRequest(
            "com.tmax.service.commit.DetailService",
            {
              commit_id: commitId,
            }
          );
          commitSocket.onopen = (event) => {
            commitSocket.send(JSON.stringify(commitSocketRequest));
          };

          commitSocket.onmessage = (event) => {
            setSourceCodeList(JSON.parse(event.data).body.data);
          };
        } else {
          setCommitList([]);
          setSourceCodeList([]);
        }
      };
    };
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
      setAlert(
        "Delete Reference",
        `Delete Project List from ${projectData.name}.`,
        "success"
      );
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
  setSelectedProject?: Function;
  setSelectedReference?: Function;
  setCommitList?: Function;
};
