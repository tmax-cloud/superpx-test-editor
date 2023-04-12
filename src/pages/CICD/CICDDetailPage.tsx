import { Button } from '@mui/material';
import { Observer, observer } from 'mobx-react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import WorkspaceStore from '../../stores/workspaceStore';
import { sendMessage } from '../../utils/service-utils';

const CICDDetailPage = () => {
  const { projectName, cicdId } = useParams();
  const menus = [
    { name: 'Details', to: `/px/projects/${projectName}/details` },
    { name: 'CI/CD Report', to: `/px/projects/${projectName}/CICDList` },
    // 'Issues',
    // 'Merge Requests',
    // 'Settings',
    // 'PX Analysis',
  ];
  const step = (taskStatus: number) => {
    switch (taskStatus) {
      case 0:
        return 'Pending';
      case 1:
        return 'Processing';
      case 2:
        return 'Success';
      case 3:
        return 'Failed';
    }
  };
  const requestCicdDetail = () => {
    sendMessage(
      'service',
      'GetHistoryDetail',
      {
        cicd_id: cicdId,
      },
      'super-px/com.tmax.buildanddeploy',
    );
  };

  React.useEffect(() => {
    requestCicdDetail();
    const timer = setInterval(() => requestCicdDetail(), 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);

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
          <div className="project-page">
            <div className="detail-page-title">
              <h1>CICD Detail</h1>
            </div>
            <div className="cicd-detail">
              <div>Project Name: {WorkspaceStore.currentCICD.projName}</div>
              <div>Reference Name: {WorkspaceStore.currentCICD.refName}</div>
              <div>
                Mode:{' '}
                {WorkspaceStore.currentCICD.targetIp
                  ? 'Master Worker'
                  : 'Stand Alone'}
              </div>
              <div>Created Time: {WorkspaceStore.currentCICD.createdTime}</div>
              <div>Status: {step(WorkspaceStore.currentCICD.result)}</div>
              <div>
                Read File From DB{': '}
                {step(WorkspaceStore.currentCICD.readFileFromDB)}, Build Project
                {': '}
                {step(WorkspaceStore.currentCICD.buildProject)}, Read Build File
                {': '}
                {step(WorkspaceStore.currentCICD.readBuildFile)}, Deploy App
                {': '}
                {step(WorkspaceStore.currentCICD.deployApp)}
              </div>
            </div>
          </div>
        )}
      </Observer>
    </div>
  );
};
export default observer(CICDDetailPage);
