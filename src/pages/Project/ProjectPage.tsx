import * as React from 'react';
import { Observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { CreateProjectForm } from '../../components/Form/CreateProjectForm';
import WorkspaceStore from '../../stores/workspaceStore';
import { sendMessage } from '../../utils/service-utils';
import Button from '@mui/material/Button';

const ProjectPage: React.FC = () => {
  const [openCreateProjectForm, setOpenCreateProjectForm] =
    React.useState(false);
  React.useEffect(() => {
    sendMessage('project', 'ListService', {});
  }, []);
  return (
    <Observer>
      {() => (
        <div>
          <CreateProjectForm
            open={openCreateProjectForm}
            setOpen={setOpenCreateProjectForm}
          />
          {WorkspaceStore.projectList.map((project) => {
            return (
              <div>
                <Link
                  key={`project-${project.projId}`}
                  to={`/projects/${project.name}`}
                >
                  <Button>{project.name}</Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </Observer>
  );
};

export default ProjectPage;
