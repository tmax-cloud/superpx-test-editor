import * as React from "react";
import Alert, { AlertColor } from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import alertStore from "../../stores/alertStore";
import { useObserver } from "mobx-react";

export const BaseAlert: React.FC = () => {
  return (
    <div className="alert">
      {useObserver(() => (
        <div>
          {alertStore.isAlert && (
            <Alert
              severity={alertStore.type || "info"}
              onClose={() => {
                alertStore.setIsAlertAction(false);
              }}
            >
              {alertStore.title && <AlertTitle>{alertStore.title}</AlertTitle>}
              {alertStore.message}
            </Alert>
          )}
        </div>
      ))}
    </div>
  );
};
