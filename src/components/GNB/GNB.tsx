import * as React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import EditorContentsStore from '../../stores/editorContentsStore';
import I18nButton from '../../utils/i18n/I18nButton';
export const GNB = () => {
  return (
    <div className="gnb">
      <div className="logo">
        <Link to="/">
          <HomeIcon className="logo-icon" sx={{ color: '#FF7575' }} />
          <p className="logo-text">SuperPX</p>
        </Link>
        <Link to="/">
          <p className="top-menu-text-left">Projects</p>
        </Link>
        {/* <Link to="/groups">
          <p className="top-menu-text">Groups</p>
        </Link> */}
        <Link
          to="/editor"
          onClick={() => {
            EditorContentsStore.updateEditorLnbInitState('scm');
          }}
        >
          <p className="top-menu-text">Editor</p>
        </Link>
        <Link to="/about">
          <p className="top-menu-text">About</p>
        </Link>
      </div>
      <I18nButton />
    </div>
  );
};
