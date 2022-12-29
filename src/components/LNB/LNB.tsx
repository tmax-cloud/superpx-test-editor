import * as React from "react";
import { setRequest } from "../../utils/service-utils";
import { ProjectLink } from "./ProjectLink";
import { RefernceLink } from "./ReferenceLink";
import { SourceCodeLink } from "./SourceCodeLink";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

export const LNB: React.FC<LNBProps> = ({ wsUrl, setEditorText }) => {
  const [projectList, setProjectList] = React.useState([]);
  const [showProjectList, setShowProjectList] = React.useState(true);
  const [referenceList, setReferenceList] = React.useState([]);
  const [showReferenceList, setShowReferenceList] = React.useState(true);
  const [sourceCodeList, setSourceCodeList] = React.useState([]);
  const [showOpenSouceCodeList, setShowOpenSouceCodeList] =
    React.useState(true);

  type LNB = "explorer" | "search" | "scm" | "debug" | "extension";

  const [state, setState] = React.useState({
    explorer: false,
    search: false,
    scm: false,
    debug: false,
    extension: false,
  });
  const toggleDrawer =
    (lnb: LNB, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [lnb]: open });
    };

  const list = (lnb: LNB) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(lnb, false)}
      onKeyDown={toggleDrawer(lnb, false)}
    >
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  React.useEffect(() => {
    const exampleSocket = new WebSocket(wsUrl);
    const request = setRequest("com.tmax.service.project.ListService", {});
    exampleSocket.onopen = (event) => {
      exampleSocket.send(JSON.stringify(request));
    };

    exampleSocket.onmessage = (event) => {
      console.log(event.data);
      const wsdata = JSON.parse(event.data).body.data;

      const tempProjectList = [];
      console.log(wsdata);
      wsdata.forEach((d) => {
        tempProjectList.push(d);
      });

      setProjectList(tempProjectList);
      setEditorText(`Get Project List from ${wsUrl}.`);
    };
  }, []);

  return (
    <div className="sidebar">
      {(["explorer", "search", "scm", "debug", "extension"] as const).map(
        (lnb) => (
          <div>
            <Link to={`/${lnb}`}>
              <Button>{lnb}</Button>
            </Link>
          </div>
        )
      )}

      <div>
        {/* <div>
          {(["explorer", "search", "scm", "debug", "extension"] as const).map(
            (lnb) => (
              <div key={lnb}>
                <Button onClick={toggleDrawer(lnb, true)}>{lnb}</Button>
                <Drawer open={state[lnb]} onClose={toggleDrawer(lnb, false)}>
                  {list(lnb)}
                </Drawer>
              </div>
            )
          )}
        </div> */}
        <h3>ProjectList</h3>
        <button
          onClick={() => {
            setShowProjectList(!showProjectList);
          }}
        >
          {showProjectList ? "접기" : "열기"}
        </button>
        {showProjectList &&
          projectList.map((projectdata) => {
            return (
              <ProjectLink
                wsUrl={wsUrl}
                projectData={projectdata}
                setReferenceList={setReferenceList}
                setSourceCodeList={setSourceCodeList}
              />
            );
          })}
      </div>
      <div>
        <h3>ReferenceList</h3>
        <button
          onClick={() => {
            setShowReferenceList(!showReferenceList);
          }}
        >
          {showReferenceList ? "접기" : "열기"}
        </button>
        {showReferenceList &&
          referenceList.map((filedata) => {
            return (
              <RefernceLink
                wsUrl={wsUrl}
                referenceData={filedata}
                setSourceCodeList={setSourceCodeList}
              />
            );
          })}
      </div>
      <div>
        <h3>SourceCodeList</h3>
        <button
          onClick={() => {
            setShowOpenSouceCodeList(!showOpenSouceCodeList);
          }}
        >
          {showOpenSouceCodeList ? "접기" : "열기"}
        </button>
        {showOpenSouceCodeList &&
          sourceCodeList.map((filedata) => {
            return (
              <SourceCodeLink
                wsUrl={wsUrl}
                sourceCodeData={filedata}
                setEditorText={setEditorText}
              />
            );
          })}
      </div>
    </div>
  );
};

type LNBProps = {
  wsUrl?: string;
  setEditorText?: Function;
};
