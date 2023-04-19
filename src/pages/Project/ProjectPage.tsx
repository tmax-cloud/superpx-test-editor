import * as React from 'react';
import { observer, Observer } from 'mobx-react';
import WorkspaceStore from '../../stores/workspaceStore';
import { sendMessage } from '../../utils/service-utils';
import { Avatar, Box, Button } from '@mui/material';
import loadingStore from '../../stores/loadingStore';
import LoadingScreen from '../../components/Loading/LoadingScreen';
import TablePage from '../../utils/TablePage';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Project } from '../../utils/types';

const TableButton = () => (
  <Button variant="contained" component={Link} to="/create">
    New Project
  </Button>
);
const projectClickFuntion = (project: Project) => {
  WorkspaceStore.updateCurrentProjectAction(project);
  sendMessage('reference', 'ListService', {
    proj_name: project.name,
  });
};
const InnerComponent = (item: Project) => (
  <Link to={`/projects/${item.name}/details`}>
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ p: 2 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            borderRadius: '20%',
          }}
        >
          {item.name?.charAt(0)}
        </Avatar>
      </Box>
      <Box sx={{ p: 2 }}>
        <div className="item-name">
          <b>{item.name}</b>
        </div>
        <div className="item-name">{item.name}</div>
      </Box>
    </Box>
  </Link>
);
const ProjectPage: React.FC = () => {
  const [projectList, setProjectList] = React.useState([]);

  React.useEffect(() => {
    sendMessage('project', 'ListService', {});
  }, []);
  React.useEffect(() => {
    const tempList = [].concat(WorkspaceStore.projectList);
    tempList.sort((a, b) => a.name?.localeCompare(b.name));
    setProjectList(tempList);
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
            InnerComponent={InnerComponent}
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
