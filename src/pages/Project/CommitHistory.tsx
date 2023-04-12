import * as React from 'react';
import { Observer, observer } from 'mobx-react';
import WorkspaceStore from '../../stores/workspaceStore';
import { Avatar, Box, Button } from '@mui/material';
import { sendMessage } from '../../utils/service-utils';
import { Link, useParams } from 'react-router-dom';
import TablePage from '../../utils/TablePage';
import { Commit } from '../../utils/types';

const InnerComponent = (item: Commit) => (
  <Box sx={{ display: 'flex' }}>
    <Box sx={{ p: 2 }}>
      <Avatar
        sx={{
          bgcolor: 'primary.main',
          borderRadius: '20%',
        }}
      >
        {item.message?.charAt(0)}
      </Avatar>
    </Box>
    <Box sx={{ p: 2 }}>
      <div className="item-name">
        <b>{item.message}</b>
      </div>
      <div className="item-name">{item.createdTime}</div>
    </Box>
  </Box>
);

const CommitHistory: React.FC = () => {
  const { projectName, reference } = useParams();
  const [commitList, setCommitList] = React.useState([]);
  React.useEffect(() => {
    setCommitList(
      WorkspaceStore.commitList.sort((a, b) => {
        const dateA = new Date(a.createdTime);
        const dateB = new Date(b.createdTime);
        return dateB.getTime() - dateA.getTime();
      }),
    );
  }, []);

  React.useEffect(() => {
    setCommitList(
      WorkspaceStore.commitList.sort((a, b) => {
        const dateA = new Date(a.createdTime);
        const dateB = new Date(b.createdTime);
        return dateB.getTime() - dateA.getTime();
      }),
    );
  }, [WorkspaceStore.commitList]);
  React.useEffect(() => {
    const sendRequest = () => {
      sendMessage('commit', 'ListService', {
        proj_name: projectName,
        ref_name: reference.replace(/-dot-/g, '.').replace(/-slash-/g, '/'),
      });
    };
    sendRequest();
    const timer = setInterval(sendRequest, 20000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  const menus = [
    { name: 'Details', to: `/px/projects/${projectName}/details` },
    { name: 'CI/CD Report', to: `/px/projects/${projectName}/CICDList` },
    // 'Issues',
    // 'Merge Requests',
    // 'Settings',
    // 'PX Analysis',
  ];
  return (
    <div className="project-page-parent">
      <div className="gnb-project-page">
        {menus.map((menu) => {
          return (
            <span key={`menu-All`}>
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
              itemList={commitList}
              setItemList={setCommitList}
              InnerComponent={InnerComponent}
              rawProjectList={WorkspaceStore.commitList}
              mainName={'Commit List'}
              cellClickFuntion={() => {}}
              type="commit"
            />
          </>
        )}
      </Observer>
    </div>
  );
};

export default observer(CommitHistory);
