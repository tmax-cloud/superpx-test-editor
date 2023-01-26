import { AlertColor } from "@mui/material";
import { observable } from "mobx";

type AlertInfo = {
  title: string;
  message: string;
  type: AlertColor;
};

const AlertStore = observable({
  // state
  alertList: [] as AlertInfo[],
  // title: "Title",
  // message: "Message",
  // isAlert: false,
  // type: "info" as AlertColor,

  // action
  // setTitleAction(title) {
  //   this.title = title;
  // },

  // setMessageAction(message) {
  //   this.message = message;
  // },

  // setTypeAction(type) {
  //   this.type = type;
  // },

  // setIsAlertAction(isAlert) {
  //   this.isAlert = isAlert;
  // },

  resetAlertInfo() {
    this.alertList = [] as AlertInfo[];
  },

  addAlertInfo(alertInfo: AlertInfo) {
    this.alertList.push(alertInfo);
  },
  deleteAlertInfo(index: number) {
    this.alertList.splice(index, 1);
  },
});

export default AlertStore;
