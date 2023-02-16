import * as React from 'react';
import { sendMessage } from '../../utils/service-utils';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkspaceStore from '../../stores/workspaceStore';
import { Button, IconButton } from '@mui/material';
import { Project } from '../../utils/types';

export const ProjectLink: React.FC<ProjectLinkProps> = ({ project }) => {
  const onProjectLinkClick = async () => {
    WorkspaceStore.updateCurrentProjectAction(project);
    sendMessage('project', 'DetailService', {
      proj_name: project.name,
    });
    sendMessage('reference', 'ListService', {
      proj_name: project.name,
    });
  };
  const onDeleteClick = () => {
    sendMessage('project', 'DeleteService', {
      proj_name: project.name,
    });
    WorkspaceStore.deleteProjectAction(project.projId);
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
        {project.name}
      </Button>
      <IconButton aria-label="delete" size="small">
        <DeleteIcon onClick={onDeleteClick} fontSize="inherit" />
      </IconButton>
    </div>
  );
};

type ProjectLinkProps = {
  project: Project;
};
