import { AlertColor } from '@mui/material';
import alertStore from '../stores/alertStore';

export const setAlert = (title: string, message: string, type: AlertColor) => {
  alertStore.addAlertInfo({
    title,
    message,
    type,
  });
  setTimeout(() => {
    alertStore.deleteAlertInfo(0);
  }, 10000);
};
