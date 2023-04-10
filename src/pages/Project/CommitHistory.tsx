import * as React from 'react';
import { Observer, observer } from 'mobx-react';
import WorkspaceStore from '../../stores/workspaceStore';
import { Button } from '@mui/material';
import { sendMessage } from '../../utils/service-utils';
import { useParams } from 'react-router-dom';
import TablePage from '../../utils/TablePage';

const CommitHistory: React.FC = () => {
  const { projectName } = useParams();
  const [commitList, setCommitList] = React.useState([]);
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
    const timer = setInterval(
      () =>
        sendMessage('commit', 'ListService', {
          proj_name: projectName,
          ref_name: WorkspaceStore.currentReference.name,
        }),
      20000,
    );
    return () => {
      clearInterval(timer);
    };
  }, []);
  const menus = [
    'Details',
    // 'Issues',
    // 'Merge Requests',
    'CI/CD Report',
    // 'Settings',
    // 'PX Analysis',
  ];
  return (
    <div className="project-page-parent">
      <div className="gnb-project-page">
        {menus.map((menu) => {
          return (
            <span key={`menu-All`}>
              <Button className="gnb-menu-button" id="basic-button">
                {menu}
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
