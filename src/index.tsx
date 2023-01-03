import * as React from "react";
import * as ReactDOM from "react-dom";
import { Editor } from "./components/Editor";
import "./style.css";
import { setupLanguage } from "./java/setup";
import { languageID } from "./java/config";
import { LNB } from "./components/LNB/LNB";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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
    <>
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
        <div className="title">Java Editor</div>
        <Editor
          language={"java"}
          wsUrl={wsUrl}
          selectedReference={selectedReference}
          fileText={editorText}
          setFileText={setEditorText}
          editorFilePath={editorFilePath}
          sourceCodeList={sourceCodeList}
        />
      </div>
    </>
  );
};

const GNB = () => {
  const menus = [
    "file",
    "edit",
    "select",
    "view",
    "goto",
    "debug",
    "terminal",
    "help",
  ];
  const menusAction = {
    file: ["fileAction1", "fileAction2"],
    edit: ["editAction1", "editAction2"],
    select: ["selectAction1", "selectAction2"],
    view: ["viewAction1", "viewAction2"],
    goto: ["gotoAction1", "gotoAction2"],
    debug: ["debugAction1", "debugAction2"],
    terminal: ["terminalAction1", "terminalAction2"],
    help: ["helpAction1", "helpAction2"],
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = React.useState({});
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenMenu({ [event.currentTarget.value]: true });
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setOpenMenu({});
    setAnchorEl(null);
  };
  return (
    <>
      <Link to="/">
        <span>Home</span>
      </Link>
      {menus.map((menu) => {
        return (
          <>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              value={menu}
            >
              {menu}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openMenu[menu]}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {menusAction[menu].map((action) => {
                return <MenuItem onClick={handleClose}>{action}</MenuItem>;
              })}
            </Menu>
          </>
        );
      })}
    </>
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
