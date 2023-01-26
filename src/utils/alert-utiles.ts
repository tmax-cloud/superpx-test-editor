import { AlertColor } from "@mui/material";
import alertStore from "../stores/alertStore";

export const setAlert = (
  title?: string,
  message?: string,
  type?: AlertColor
) => {
  // alertStore.setTitleAction(title);
  // alertStore.setMessageAction(message);
  // if (type) {
  //   alertStore.setTypeAction(type);
  // }
  // alertStore.setIsAlertAction(true);
  alertStore.addAlertInfo({
    title,
    message,
    type,
  });
};
