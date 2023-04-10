import * as React from 'react';
import { Observer, observer } from 'mobx-react';
import { Button } from '@mui/material';

const CICDListPage: React.FC = () => {
  React.useEffect(() => {});
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
              <Button
                className="gnb-menu-button"
                id="basic-button"
                // aria-controls={open ? 'basic-menu' : undefined}
                // aria-haspopup="true"
                // aria-expanded={open ? 'true' : undefined}
                // onClick={handleClick}
                // value={menu}
              >
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
              CICD List Page
            </div>
          </>
        )}
      </Observer>
    </div>
  );
};

export default observer(CICDListPage);
