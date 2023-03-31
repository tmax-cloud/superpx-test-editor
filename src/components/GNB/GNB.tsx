import * as React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useParams } from 'react-router-dom';
import I18nButton from '../../utils/i18n/I18nButton';
export const GNB = () => {
  const { projectName } = useParams();
  return (
    <div className="gnb">
      <div className="logo">
        <Link to="/">
          <HomeIcon className="logo-icon" sx={{ color: '#FF7575' }} />
          <p className="logo-text">SuperPX</p>
        </Link>
        <Link to={`/projects`}>
          <p className="top-menu-text-left">Projects</p>
        </Link>
        {/* <Link to="/groups">
          <p className="top-menu-text">Groups</p>
        </Link> */}
        <Link
          to={`/projects/${projectName}/details`}
          className={`top-menu-link ${!projectName ? 'disabled' : ''}`}
        >
          <p className="top-menu-text">PX Manager</p>
        </Link>

        <Link
          to={`/projects/${projectName}/editor`}
          className={`top-menu-link ${!projectName ? 'disabled' : ''}`}
        >
          <p className="top-menu-text">PX Editor</p>
        </Link>
      </div>
      {projectName && <div className="top-head-text">{projectName}</div>}
      <I18nButton />
    </div>
  );
};
