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
const wsUrl = "ws://172.22.11.2:38080";
setupLanguage();
const App = () => {
  const [editorText, setEditorText] = React.useState(testCode);
  return (
    <div>
      <SideBar wsUrl={wsUrl} setEditorText={setEditorText} />
      <div className="editor-area">
        <div className="title">Java Editor</div>
        <Editor
          language={"java"}
          fileText={editorText}
          setFileText={setEditorText}
        ></Editor>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("container"));
