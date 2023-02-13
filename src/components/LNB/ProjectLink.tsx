import * as React from 'react';
import { setRequest } from '../../utils/service-utils';
import DeleteIcon from '@mui/icons-material/Delete';
import { setAlert } from '../../utils/alert-utiles';
import WorkspaceStore from '../../stores/workspaceStore';
import { Button, IconButton } from '@mui/material';

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
    const request = setRequest('project', 'DetailService', {
      proj_name: projectData.name,
    });
    projectSocket.onopen = (event) => {
      projectSocket.send(JSON.stringify(request));
    };

    projectSocket.onmessage = (event) => {
      const wsdata = JSON.parse(event.data).data;
      setAlert(
        'Get Reference',
        `Get Reference List from Project ${wsdata.name}.`,
        'success',
      );
    };
    const referenceSocket = new WebSocket(wsUrl);
    const referenceRequest = setRequest('reference', 'ListService', {
      proj_name: projectData.name,
    });
    referenceSocket.onopen = (event) => {
      referenceSocket.send(JSON.stringify(referenceRequest));
    };

    referenceSocket.onmessage = (event) => {
      const referenceList = JSON.parse(event.data).data;
      setReferenceList(referenceList);
      const mainReference =
        referenceList.filter((r) => r.name === 'main')[0] || referenceList[0];
      WorkspaceStore.updateReferenceAction(mainReference);
      const commitSocket = new WebSocket(wsUrl);
      const commitSocketRequest = setRequest('commit', 'ListService', {
        proj_name: projectData.name,
        ref_name: mainReference.name,
      });
      commitSocket.onopen = (event) => {
        commitSocket.send(JSON.stringify(commitSocketRequest));
      };

      commitSocket.onmessage = (event) => {
        if (JSON.parse(event.data).data) {
          setCommitList(JSON.parse(event.data).data);
        }
        const commitId = JSON.parse(event.data).data
          ? JSON.parse(event.data).data[0].commitId
          : null;
        if (commitId) {
          const commitSocket = new WebSocket(wsUrl);
          const commitSocketRequest = setRequest('commit', 'DetailService', {
            commit_id: commitId,
          });
          commitSocket.onopen = (event) => {
            commitSocket.send(JSON.stringify(commitSocketRequest));
          };

          commitSocket.onmessage = (event) => {
            WorkspaceStore.updateSourceCodeListAction(
              JSON.parse(event.data).data,
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
    const request = setRequest('project', 'DeleteService', {
      proj_name: projectData.name,
    });
    projectSocket.onopen = (event) => {
      projectSocket.send(JSON.stringify(request));
    };

    projectSocket.onmessage = (event) => {
      setAlert(
        'Delete Reference',
        `Delete Project List from ${projectData.name}.`,
        'success',
      );
    };
    deleteProjectList(projectData.projId);
  };

  return (
    <div className="commit-link">
      <Button
        size="small"
        variant="text"
        color="inherit"
        className="commit-btn"
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
