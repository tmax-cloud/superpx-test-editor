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
const testCode = `class Simple{
  public static void main(String args[]){
    System.out.println("Hello Java");
  }
}`;
const wsUrl = "ws://172.22.11.2:38080";
setupLanguage();
const App = () => {
  return (
    <div>
      <BaseAlert />
      <GNB />
      <Routes>
        <Route path="/" element={<Main />}></Route>
        {/* <Route path="/project/*" element={<Project />}></Route> */}
        {(["explorer", "search", "scm", "debug", "extension"] as const).map(
          (lnb) => (
            <Route path={`/${lnb}`} element={<LNB wsUrl={wsUrl} />}></Route>
          )
        )}
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
};

const Main = () => {
  const [editorText, setEditorText] = React.useState(testCode);
  const [editorFilePath, setEditorFilePath] = React.useState("");
  const [selectedReference, setSelectedReference] = React.useState({
    name: "",
    refId: 0,
    projId: 0,
    type: 0,
  });
  const [sourceCodeList, setSourceCodeList] = React.useState([]);

  return (
    <div>
      <LNB
        wsUrl={wsUrl}
        setEditorText={setEditorText}
        setEditorFilePath={setEditorFilePath}
        selectedReference={selectedReference}
        setSelectedReference={setSelectedReference}
        sourceCodeList={sourceCodeList}
        setSourceCodeList={setSourceCodeList}
      />
      <div className="editor-area">
        {/* <div className="title">Java Editor</div> */}
        <Editor
          language={languageID}
          wsUrl={wsUrl}
          selectedReference={selectedReference}
          fileText={editorText}
          setFileText={setEditorText}
          editorFilePath={editorFilePath}
          sourceCodeList={sourceCodeList}
        />
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
