import { observable } from "mobx";

const Alert = `import * as React from "react";
// import Alert, { AlertColor } from "@mui/material/Alert";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import alertStore from "../../stores/alertStore";
import { useObserver } from "mobx-react";

export const BaseAlert: React.FC = () => {
  return (
    <div className="alert">
      {useObserver(() => (
        <div>
          {/* {alertStore.isAlert && (
            <Alert
              severity={alertStore.type || "info"}
              onClose={() => {
                alertStore.setIsAlertAction(false);
              }}
            >
              {alertStore.title && <AlertTitle>{alertStore.title}</AlertTitle>}
              {alertStore.message}
            </Alert>
          )} */}
          {alertStore.alertList.length > 1 && (
            <Alert severity="info" onClose={() => alertStore.resetAlertInfo()}>
              Close All
            </Alert>
          )}

          {alertStore.alertList.map((alert, index) => (
            <Alert
              severity={alert.type || "info"}
              onClose={() => {
                alertStore.deleteAlertInfo(index);
              }}
            >
              {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
              {alert.message}
            </Alert>
          ))}
        </div>
      ))}
    </div>
  );
};`;

const index = `import * as React from "react";
import * as ReactDOM from "react-dom";
import { Editors } from "./components/Editor/Editors";
import "./style.css";
import { setupLanguage } from "./java/setup";
import { languageID } from "./java/config";
import { GNB } from "./components/GNB/GNB";
import { LNB } from "./components/LNB/LNB";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BaseAlert } from "./components/Alert/Alert";

export const defaultWsUrl = "ws://172.22.11.2:38080";
setupLanguage();
const App = () => {
  return (
    <div>
      <BaseAlert />
      <GNB />
      <Routes>
        {/* <Route path="/project/*" element={<Project />}></Route> */}
        {(["explorer", "search", "scm", "debug", "extension"] as const).map(
          (lnb) => (
            <Route
              key={route-${"lnb"}}
              path={/${"lnb"}}
              element={<GNB />}
            ></Route>
          )
        )}
        <Route path="/" element={<Main />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
};

const Main = () => {
  return (
    <div>
      <LNB />
      <div className="editor-area">
        {/* <div className="title">Java Editor</div> */}        
        <Editors />
      </div>
    </div>
  );
};

const NotFound = () => {
  return <div>404 Error</div>;
};

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("container")
);
`;

const Counter = `import * as React from "react";
import { useObserver } from "mobx-react";
import indexStore from "../stores/indexStore";

export const Counter: React.FC<{}> = () => {
  const { numberStore } = indexStore();

  const onClickIncrease = () => {
    numberStore.increaseAction(3);
  };

  const onClickDecrease = () => {
    numberStore.decreaseAction(2);
  };
  return useObserver(() => (
    <div>
      <p>현재 값: {numberStore.num}</p>

      <button onClick={onClickIncrease}>증가</button>
      <button onClick={onClickDecrease}>감소</button>
    </div>
  ));
};`;

const testStore = observable({
//state
fileList : [{ path: "src/component/Alert/Alert.tsx", content: Alert },
{ path: "src/index.tsx", content: index },
{ path: "src/component/Counter.tsx", content: Counter },],

//Action
addAction(path: string){
    this.fileList.push({path, content:""});
},

deleteAction(path: string){
    this.fileList = this.fileList.filter((file)=>{
        return file.path !== path;
    });
},

});

export default testStore;