import * as React from "react";
import * as ReactDOM from "react-dom";
import { Editor } from "./components/Editor";
import "./style.css";
import { setupLanguage } from "./java/setup";
import { languageID } from "./java/config";
import { SideBar } from "./components/SideBar/Sidebar";

// import { language } from "./java";
const testCode = `class Simple{
  public static void main(String args[]){
    System.out.println("Hello Java");
  }
}`;
// const wsUrl = "ws://192.168.9.74:8080";
setupLanguage();
const App = () => {
  const [wsUrl, setWsUrl] = React.useState("ws://172.22.11.6:8080");
  const [fileText, setFileText] = React.useState(testCode);
  return (
    <div>
      <SideBar wsUrl={wsUrl} setWsUrl={setWsUrl} setFileText={setFileText} />
      <div className="editor-area">
        <div className="title">Java Editor</div>
        <Editor
          language={"java"}
          fileText={fileText}
          setFileText={setFileText}
        ></Editor>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("container"));
