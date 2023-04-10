import { AlertColor } from '@mui/material';
import alertStore from '../stores/alertStore';
import loadingStore from '../stores/loadingStore';

export const setAlert = (title: string, message: string, type: AlertColor) => {
  loadingStore.setLoading(false);
  alertStore.addAlertInfo({
    title,
    message,
    type,
  });
  setTimeout(() => {
    alertStore.deleteAlertInfo(0);
  }, 10000);
};
