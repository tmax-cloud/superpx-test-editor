import * as React from "react";
import { setRequest, setService } from "../../utils/service-utils";
import DeleteIcon from "@mui/icons-material/Delete";
import { setAlert } from "../../utils/alert-utiles";
import WorkspaceStore from "../../stores/workspaceStore";
import { Button, IconButton } from "@mui/material";

export const ProjectLink: React.FC<ProjectLinkProps> = ({
  wsUrl,
  projectData,
  setReferenceList,
  deleteProjectList,
  setSelectedProject,
  setCommitList,
}) => {
  const onProjectLinkClick = async () => {
    setSelectedProject(projectData);
    const projectSocket = new WebSocket(wsUrl);
    const request = setRequest(setService("project","DetailService"), {
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
    const referenceSocket = new WebSocket(wsUrl);
    const referenceRequest = setRequest(
      setService("reference","ListService"),
      {
        proj_id: projectData.projId,
      }
    );
    referenceSocket.onopen = (event) => {
      referenceSocket.send(JSON.stringify(referenceRequest));
    };

    referenceSocket.onmessage = (event) => {
      const referenceList = JSON.parse(event.data).body.data;
      setReferenceList(referenceList);
      const mainReference =
        referenceList.filter((r) => r.name == "main")[0] || referenceList[0];
      WorkspaceStore.updateReferenceAction(mainReference);
      const commitSocket = new WebSocket(wsUrl);
      const commitSocketRequest = setRequest(
        setService("commit","ListService"),
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
            setService("commit","DetailService"),
            {
              commit_id: commitId,
            }
          );
          commitSocket.onopen = (event) => {
            commitSocket.send(JSON.stringify(commitSocketRequest));
          };

          commitSocket.onmessage = (event) => {
            WorkspaceStore.updateSourceCodeListAction(
              JSON.parse(event.data).body.data
            );
          };
        } else {
          setCommitList([]);
          WorkspaceStore.updateSourceCodeListAction([]);
        }
      };
    };
  };
  const onDeleteClick = () => {
    const projectSocket = new WebSocket(wsUrl);
    const request = setRequest(setService("project","DeleteService"), {
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
    <div style={{ paddingLeft: 15 }}>
      <Button
        size="small"
        variant="text"
        color="inherit"
        style={{ textTransform: "none" }}
        onClick={onProjectLinkClick}
      >
        {projectData.name}
      </Button>
      <IconButton aria-label="delete" size="small">
        <DeleteIcon onClick={onDeleteClick} fontSize="inherit" />
      </IconButton>
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
  deleteProjectList?: Function;
  setSelectedProject?: Function;
  setCommitList?: Function;
};
