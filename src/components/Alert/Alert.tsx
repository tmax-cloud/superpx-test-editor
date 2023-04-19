import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import alertStore from '../../stores/alertStore';
import { Observer } from 'mobx-react';

export const BaseAlert: React.FC = () => {
  return (
    <div className="alert">
      <Observer>
        {() => (
          <div>
            {alertStore.alertList.length > 1 && (
              <Alert
                severity="info"
                onClose={() => alertStore.resetAlertInfo()}
              >
                Close All
              </Alert>
            )}
            {alertStore.alertList.map((alert, index) => (
              <Alert
                severity={alert.type || 'info'}
                onClose={() => {
                  alertStore.deleteAlertInfo(index);
                }}
              >
                {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                {alert.message}
              </Alert>
            ))}
          </div>
        )}
      </Observer>
    </div>
  );
};
