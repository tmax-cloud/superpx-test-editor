import * as React from "react";
import * as ReactDOM from "react-dom";
import { Editor } from "./components/Editor";
import "./style.css";
import { setupLanguage } from "./java/setup";
import { languageID } from "./java/config";
import { GNB } from "./components/GNB/GNB";
import { LNB } from "./components/LNB/LNB";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BaseAlert } from "./components/Alert/Alert";

// import { language } from "./java";
// const testCode = `class Simple{
//   public static void main(String args[]){
//     System.out.println("Hello Java");
//   }
// }`;
const wsUrl = "ws://172.22.11.2:38080";
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
              key={`route-${lnb}`}
              path={`/${lnb}`}
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
      <LNB wsUrl={wsUrl} />
      <div className="editor-area">
        {/* <div className="title">Java Editor</div> */}
        <Editor language={languageID} wsUrl={wsUrl} />
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
