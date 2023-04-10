import * as React from 'react';
import { Observer, observer } from 'mobx-react';
import WorkspaceStore from '../../stores/workspaceStore';
import { Button } from '@mui/material';
import { sendMessage } from '../../utils/service-utils';
import { useParams } from 'react-router-dom';

const CommitHistory: React.FC = () => {
  const { projectName } = useParams();

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
    <div>
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
            <div>
              {WorkspaceStore.commitList.map((commit) => {
                return (
                  <div>
                    <p>{commit.commitId}</p>
                    <p>{commit.message}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Observer>
    </div>
  );
};

export default observer(CommitHistory);
