import { Avatar, Box, Button } from '@mui/material';
import { Observer, observer } from 'mobx-react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import WorkspaceStore from '../../stores/workspaceStore';
import { sendMessage } from '../../utils/service-utils';
import TablePage from '../../utils/TablePage';
import { CICD } from '../../utils/types';

const InnerComponent = (item: CICD) => (
  <Link to={`/projects/${item.projName}/details`}>
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ p: 2 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            borderRadius: '20%',
          }}
        >
          {String(item.cicdId)?.charAt(0)}
        </Avatar>
      </Box>
      <Box sx={{ p: 2 }}>
        <div className="item-name">
          <b>{item.cicdId}</b>
        </div>
        <div className="item-name">{item.createdTime}</div>
      </Box>
    </Box>
  </Link>
);

const CICDListPage = () => {
  const { projectName } = useParams();
  const [cicdList, setCicdList] = React.useState([]);
  const menus = [
    { name: 'Details', to: `/projects/${projectName}/details` },
    { name: 'CI/CD Report', to: `/projects/${projectName}/CICDList` },
    // 'Issues',
    // 'Merge Requests',
    // 'Settings',
    // 'PX Analysis',
  ];
  React.useEffect(() => {
    sendMessage('project', 'DetailService', {
      proj_name: projectName,
    });
  }, []);
  React.useEffect(() => {
    WorkspaceStore.currentProject?.projId &&
      sendMessage(
        'service',
        'GetHistoryList',
        {
          proj_id: WorkspaceStore.currentProject.projId,
        },
        'super-px/com.tmax.buildanddeploy',
      );
  }, [WorkspaceStore.currentProject]);
  React.useEffect(() => {
    setCicdList(WorkspaceStore.CICDList);
  }, [WorkspaceStore.CICDList]);

  return (
    <div className="project-page-parent">
      <div className="gnb-project-page">
        {menus.map((menu) => {
          return (
            <span key={`menu-All-${menu.name}`}>
              <Button
                className="gnb-menu-button"
                id="basic-button"
                component={Link}
                to={menu.to}
              >
                {menu.name}
              </Button>
            </span>
          );
        })}
      </div>
      <Observer>
        {() => (
          <>
            <TablePage
              itemList={cicdList}
              setItemList={setCicdList}
              InnerComponent={InnerComponent}
              rawProjectList={WorkspaceStore.CICDList}
              mainName={'CI/CD Report'}
              cellClickFuntion={() => {}}
              type="CICD"
            />
          </>
        )}
      </Observer>
    </div>
  );
};
export default observer(CICDListPage);
