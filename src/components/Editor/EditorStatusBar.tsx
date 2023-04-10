import * as React from 'react';
import Error from '@mui/icons-material/Error';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import AlertStore from '../../stores/alertStore';
import { Observer } from 'mobx-react';

export const EditorStatusBar = () => {
  return (
    <Observer>
      {() => (
        <div className="editor-status-bar">
          <span className="editor-status-bar-debug">
            <Error />
            <span>0</span>
            <ErrorOutline />
            <span>0</span>
          </span>
          <span className="editor-status-bar-alert">
            {AlertStore.alertList && AlertStore.alertList.length > 0 ? (
              <>
                <NotificationsIcon color="action" />
                <span>{AlertStore.alertList.length}</span>
              </>
            ) : (
              <NotificationsNoneIcon />
            )}
            <WysiwygIcon />
          </span>
        </div>
      )}
    </Observer>
  );
};
