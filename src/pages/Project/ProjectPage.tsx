import * as React from 'react';
import { observer, Observer } from 'mobx-react';
import WorkspaceStore from '../../stores/workspaceStore';
import { sendMessage } from '../../utils/service-utils';
import { Button } from '@mui/material';
import loadingStore from '../../stores/loadingStore';
import LoadingScreen from '../../components/Loading/LoadingScreen';
import TablePage from '../../utils/TablePage';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const TableButton = () => (
  <Button variant="contained" component={Link} to="/create">
    New Project
  </Button>
);
const projectClickFuntion = (project) => {
  WorkspaceStore.updateCurrentProjectAction(project);
  sendMessage('reference', 'ListService', {
    proj_name: project.name,
  });
};

const ProjectPage: React.FC = () => {
  const [projectList, setProjectList] = React.useState([]);

  React.useEffect(() => {
    sendMessage('project', 'ListService', {});
  }, []);
  React.useEffect(() => {
    setProjectList(
      WorkspaceStore.projectList.sort((a, b) => a.name.localeCompare(b.name)),
    );
  }, [WorkspaceStore.projectList]);
  const { t } = useTranslation();
  return (
    <Observer>
      {() => (
        <div className="project-page-parent">
          {loadingStore.loading && <LoadingScreen />}
          <div className="gnb-project-page">
            <span key={`menu-All`}>
              <Button className="gnb-menu-button" id="basic-button">
                {'All'}
              </Button>
            </span>
            <span key={`menu-Favorites`}>
              <Button className="gnb-menu-button" id="basic-button">
                {'Favorites'}
              </Button>
            </span>
          </div>
          <TablePage
            itemList={projectList}
            setItemList={setProjectList}
            rawProjectList={WorkspaceStore.projectList}
            mainName={t('PROJECTMAIN')}
            TableButton={<TableButton />}
            cellClickFuntion={projectClickFuntion}
            type="project"
          />
        </div>
      )}
    </Observer>
  );
};
export default observer(ProjectPage);
