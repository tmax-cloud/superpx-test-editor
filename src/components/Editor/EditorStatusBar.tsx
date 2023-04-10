import * as React from 'react';
import Error from '@mui/icons-material/Error';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import Badge from '@mui/material/Badge';
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
              <Badge badgeContent={AlertStore.alertList.length} color="primary">
                <NotificationsIcon color="action" />
              </Badge>
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
