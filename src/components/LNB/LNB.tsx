import * as React from "react";
import * as _ from "lodash-es";
import { setRequest } from "../../utils/service-utils";
import { ProjectLink } from "./ProjectLink";
import { ReferenceLink } from "./ReferenceLink";
import { SourceCodeLink } from "./SourceCodeLink";
import { CommitLink } from "./CommitLink";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import { CreateProjectForm } from "../Form/CreateProjectForm";
import { CreateReferenceForm } from "../Form/CreateReferenceForm";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { setAlert } from "../../utils/alert-utiles";
import EditorContentsStore from "../../stores/editorContentsStore";
import WorkspaceStore from "../../stores/workspaceStore";
import { useObserver } from "mobx-react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SearchIcon from "@mui/icons-material/Search";
import CommitIcon from "@mui/icons-material/Commit";
import BugReportIcon from "@mui/icons-material/BugReport";
import ExtensionIcon from "@mui/icons-material/Extension";
import { Counter } from "../Counter";
import { BasicTree } from "../BasicTree";

const drawerWidth = 240;

type Lnb = "explorer" | "search" | "scm" | "debug" | "extension";

export const LNB: React.FC<LNBProps> = ({}) => {
  const [projectList, setProjectList] = React.useState([]);
  const [referenceList, setReferenceList] = React.useState([]);
  const [commitList, setCommitList] = React.useState([]);
  const [selectedProject, setSelectedProject] = React.useState({
    name: "",
    projId: 0,
  });
  const [openCreateProjectForm, setOpenCreateProjectForm] =
    React.useState(false);
  const [openCreateReferenceForm, setOpenCreateReferenceForm] =
    React.useState(false);

  const [lnbOpenState, setLnbOpenState] = React.useState({
    explorer: false,
    search: false,
    scm: true,
    debug: false,
    extension: false,
  });
  const lnbIcon = {
    explorer: <LibraryBooksIcon />,
    search: <SearchIcon />,
    scm: <CommitIcon />,
    debug: <BugReportIcon />,
    extension: <ExtensionIcon />,
  };
  const toggleDrawer =
    (lnb: Lnb, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      _.merge;

      setLnbOpenState(
        _.merge(
          {
            explorer: false,
            search: false,
            scm: false,
            debug: false,
            extension: false,
          },
          { [lnb]: open }
        )
      );
    };

  React.useEffect(() => {
    const projectSocket = new WebSocket(WorkspaceStore.wsUrl);
    const request = setRequest("com.tmax.service.project.ListService", {});
    projectSocket.onopen = (event) => {
      projectSocket.send(JSON.stringify(request));
    };

    projectSocket.onmessage = (event) => {
      const wsdata = JSON.parse(event.data).body.data;

      const tempProjectList = [];
      wsdata.forEach((d) => {
        tempProjectList.push(d);
      });

      setProjectList(tempProjectList);
      setAlert(
        "Get Project",
        `Get Project List from ${WorkspaceStore.wsUrl}.`,
        "success"
      );
    };
  }, []);
  const updateProjectList = (project) => {
    const tempProjectList = projectList;
    tempProjectList.push(project);
    setProjectList(tempProjectList);
  };
  const updateReferenceList = (reference) => {
    const tempReferenceList = referenceList;
    tempReferenceList.push(reference);
    setReferenceList(tempReferenceList);
  };
  const deleteProjectList = (projId) => {
    setProjectList(projectList.filter((p) => p.projId != projId));
  };

  const [newFilePath, setNewFilePath] = React.useState("");

  const onSourcePathChange = (event) => {
    setNewFilePath(event.target.value);
  };

  const onAddSourceCodeClick = () => {
    EditorContentsStore.updateContentAction(newFilePath, "");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 50,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 50,
            boxSizing: "border-box",
          },
        }}
        // className="sidebar"
      >
        <div style={{ height: 50 }}></div>
        {(["explorer", "search", "scm", "debug", "extension"] as const).map(
          (lnb) => (
            <Button
              id={`lnb-${lnb}`}
              onClick={toggleDrawer(lnb, true)}
              style={{ zIndex: 1800 }}
            >
              {lnbIcon[lnb]}
            </Button>
          )
        )}
        {(["explorer", "search", "scm", "debug", "extension"] as const).map(
          (lnb) => (
            <>
              <Drawer
                sx={{
                  width: drawerWidth + 30,
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: {
                    width: drawerWidth + 30,
                    boxSizing: "border-box",
                  },
                  zIndex: 0,
                }}
                anchor="left"
                open={lnbOpenState[lnb]}
                onClose={toggleDrawer(lnb, false)}
                variant="persistent"
              >
                <div style={{ height: 40 }}></div>
                <Button onClick={toggleDrawer(lnb, false)}>
                  <CloseIcon
                    style={{ position: "absolute", right: 0, top: 0 }}
                  />
                </Button>

                {lnb === "scm" && (
                  <div style={{ paddingLeft: 50 }}>
                    <div>
                      <h3 style={{ paddingLeft: 10 }}>Project List</h3>
                      <Accordion defaultExpanded={true}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>{WorkspaceStore.wsUrl}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <CreateProjectForm
                            wsUrl={WorkspaceStore.wsUrl}
                            open={openCreateProjectForm}
                            setOpen={setOpenCreateProjectForm}
                            updateProjectList={updateProjectList}
                          />
                        </AccordionDetails>
                        {projectList.map((projectData) => {
                          return (
                            <ProjectLink
                              key={`project-${projectData.projId}`}
                              wsUrl={WorkspaceStore.wsUrl}
                              projectData={projectData}
                              setReferenceList={setReferenceList}
                              deleteProjectList={deleteProjectList}
                              setSelectedProject={setSelectedProject}
                              setCommitList={setCommitList}
                            />
                          );
                        })}
                      </Accordion>
                    </div>
                    <Divider />
                    <div>
                      <h3 style={{ paddingLeft: 10 }}>Reference List</h3>
                      <Accordion defaultExpanded={true}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>
                            {selectedProject.name
                              ? selectedProject.name
                              : "Select Project, please"}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <CreateReferenceForm
                            wsUrl={WorkspaceStore.wsUrl}
                            open={openCreateReferenceForm}
                            selectedProject={selectedProject}
                            setOpen={setOpenCreateReferenceForm}
                            updateReferenceList={updateReferenceList}
                          />
                        </AccordionDetails>
                        {referenceList.map((referenceData) => {
                          return (
                            <ReferenceLink
                              key={`project-${referenceData.refId}`}
                              wsUrl={WorkspaceStore.wsUrl}
                              referenceData={referenceData}
                              setCommitList={setCommitList}
                            />
                          );
                        })}
                      </Accordion>
                    </div>
                    <Divider />
                    <div>
                      <h3 style={{ paddingLeft: 10 }}>Commit List</h3>
                      <Accordion defaultExpanded={true}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>
                            {WorkspaceStore.reference.name
                              ? WorkspaceStore.reference.name
                              : "Select Project, please"}
                          </Typography>
                        </AccordionSummary>
                        {commitList.map((commitData) => {
                          return (
                            <CommitLink
                              key={`commit-${commitData.commitId}`}
                              wsUrl={WorkspaceStore.wsUrl}
                              commitData={commitData}
                            />
                          );
                        })}
                      </Accordion>
                    </div>
                  </div>
                )}
                {lnb === "extension" && (
                  <div style={{ paddingLeft: 50 }}>
                    <BasicTree/>
                  </div>
                )}
                {lnb === "explorer" && (
                  <div style={{ paddingLeft: 50 }}>
                    <div>
                      <h3 style={{ paddingLeft: 10 }}>Source Code List</h3>
                      <Accordion defaultExpanded={true}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>
                            {WorkspaceStore.reference.name
                              ? WorkspaceStore.reference.name
                              : "Select Project, please"}
                          </Typography>
                        </AccordionSummary>

                        {WorkspaceStore.sourceCodeList.length > 0 && (
                          <>
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="Source Code Path"
                              type="text"
                              fullWidth
                              variant="standard"
                              onChange={onSourcePathChange}
                            />
                            <Button
                              variant="outlined"
                              onClick={onAddSourceCodeClick}
                            >
                              Add Source Code
                              <AddIcon />
                            </Button>
                          </>
                        )}
                        {useObserver(
                          () =>
                            WorkspaceStore.sourceCodeList.length > 0 &&
                            WorkspaceStore.sourceCodeList.map(
                              (sourceCodeData) => {
                                return (
                                  <SourceCodeLink
                                    key={`sourceCodeD-${sourceCodeData.srcPath}`}
                                    sourceCodeData={sourceCodeData}
                                  />
                                );
                              }
                            )
                        )}
                      </Accordion>
                    </div>
                  </div>
                )}
              </Drawer>
            </>
          )
        )}

        {/* <div>
          <Divider />
          <h3 style={{ paddingLeft: 10 }}>Project List</h3>
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{WorkspaceStore.wsUrl}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CreateProjectForm
                wsUrl={WorkspaceStore.wsUrl}
                open={openCreateProjectForm}
                setOpen={setOpenCreateProjectForm}
                updateProjectList={updateProjectList}
              />
            </AccordionDetails>
            {projectList.map((projectData) => {
              return (
                <ProjectLink
                  key={`project-${projectData.projId}`}
                  wsUrl={WorkspaceStore.wsUrl}
                  projectData={projectData}
                  setReferenceList={setReferenceList}
                  deleteProjectList={deleteProjectList}
                  setSelectedProject={setSelectedProject}
                  setCommitList={setCommitList}
                />
              );
            })}
          </Accordion>
        </div>
        <Divider />
        <div>
          <h3 style={{ paddingLeft: 10 }}>Reference List</h3>
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                {selectedProject.name
                  ? selectedProject.name
                  : "Select Project, please"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CreateReferenceForm
                wsUrl={WorkspaceStore.wsUrl}
                open={openCreateReferenceForm}
                selectedProject={selectedProject}
                setOpen={setOpenCreateReferenceForm}
                updateReferenceList={updateReferenceList}
              />
            </AccordionDetails>
            {referenceList.map((referenceData) => {
              return (
                <ReferenceLink
                  key={`project-${referenceData.refId}`}
                  wsUrl={WorkspaceStore.wsUrl}
                  referenceData={referenceData}
                  setCommitList={setCommitList}
                />
              );
            })}
          </Accordion>
        </div>
        <Divider />
        <div>
          <h3 style={{ paddingLeft: 10 }}>Commit List</h3>
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                {WorkspaceStore.reference.name
                  ? WorkspaceStore.reference.name
                  : "Select Project, please"}
              </Typography>
            </AccordionSummary>
            {commitList.map((commitData) => {
              return (
                <CommitLink
                  key={`commit-${commitData.commitId}`}
                  wsUrl={WorkspaceStore.wsUrl}
                  commitData={commitData}
                />
              );
            })}
          </Accordion>
        </div> */}
        {/* <Divider /> */}
        {/* <div>
          <h3 style={{ paddingLeft: 10 }}>Source Code List</h3>
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                {WorkspaceStore.reference.name
                  ? WorkspaceStore.reference.name
                  : "Select Project, please"}
              </Typography>
            </AccordionSummary>

            {WorkspaceStore.sourceCodeList.length > 0 && (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Source Code Path"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={onSourcePathChange}
                />
                <Button variant="outlined" onClick={onAddSourceCodeClick}>
                  Add Source Code
                  <AddIcon />
                </Button>
              </>
            )}
            {useObserver(
              () =>
                WorkspaceStore.sourceCodeList.length > 0 &&
                WorkspaceStore.sourceCodeList.map((sourceCodeData) => {
                  return (
                    <SourceCodeLink
                      key={`sourceCodeD-${sourceCodeData.srcPath}`}
                      sourceCodeData={sourceCodeData}
                    />
                  );
                })
            )}
          </Accordion>
        </div> */}
      </Drawer>
    </Box>
  );
};

type LNBProps = {};
