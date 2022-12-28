import * as React from "react";
import * as ReactDOM from "react-dom";
import { Editor } from "./components/Editor";
import "./style.css";
import { setupLanguage } from "./java/setup";
import { languageID } from "./java/config";
import { SideBar } from "./components/SideBar/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Main />}></Route>
          {/* <Route path="/project/*" element={<Project />}></Route> */}
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const Main = () => {
  const [editorText, setEditorText] = React.useState(testCode);
  return (
    <>
      <SideBar wsUrl={wsUrl} setEditorText={setEditorText} />
      <div className="editor-area">
        <div className="title">Java Editor</div>
        <Editor
          language={"java"}
          fileText={editorText}
          setFileText={setEditorText}
        ></Editor>
      </div>
    </>
  );
};

const Header = () => {
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
    setOpenMenu({[event.currentTarget.value]:true});
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
              {menusAction[menu].map(action => {return <MenuItem onClick={handleClose}>{action}</MenuItem>})}              
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

ReactDOM.render(<App />, document.getElementById("container"));
