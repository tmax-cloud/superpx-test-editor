import { AlertColor } from "@mui/material";
import { observable } from "mobx";

const AlertStore = observable({
  // state
  title: "Title",
  message: "Message",
  isAlert: false,
  type: "info" as AlertColor,

  // action
  setTitleAction(title) {
    this.title = title;
  },

  setMessageAction(message) {
    this.message = message;
  },

  setTypeAction(type) {
    this.type = type;
  },

  setIsAlertAction(isAlert) {
    this.isAlert = isAlert;
  },
});

export default AlertStore;
