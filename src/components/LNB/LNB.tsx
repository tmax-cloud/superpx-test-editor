import * as React from "react";
import { setRequest } from "../../utils/service-utils";
import { ProjectLink } from "./ProjectLink";
import { RefernceLink } from "./ReferenceLink";
import { SourceCodeLink } from "./SourceCodeLink";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import { CreateProjectForm } from "../Form/CreateProjectForm";
import { CreateReferenceForm } from "../Form/CreateReferenceForm";

export const LNB: React.FC<LNBProps> = ({ wsUrl, setEditorText }) => {
  const [projectList, setProjectList] = React.useState([]);
  const [referenceList, setReferenceList] = React.useState([]);
  const [selectedProject, setSelectedProject] = React.useState({
    name: "",
    projId: 0,
  });
  const [selectedReference, setSelectedReference] = React.useState({
    name: "",
    refId: 0,
    projId: 0,
    type: 0,
  });
  const [sourceCodeList, setSourceCodeList] = React.useState([]);
  const [openCreateProjectForm, setOpenCreateProjectForm] =
    React.useState(false);
  const [openCreateReferenceForm, setOpenCreateReferenceForm] =
    React.useState(false);

  React.useEffect(() => {
    const projectSocket = new WebSocket(wsUrl);
    const request = setRequest("com.tmax.service.project.ListService", {});
    projectSocket.onopen = (event) => {
      projectSocket.send(JSON.stringify(request));
    };

    projectSocket.onmessage = (event) => {
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

  return (
    <div className="sidebar">
      {/* {(["explorer", "search", "scm", "debug", "extension"] as const).map(
        (lnb) => (
          <div>
            <Link to={`/${lnb}`}>
              <Button>{lnb}</Button>
            </Link>
          </div>
        )
      )} */}

      <div>
        <Divider />
        <h3>Project List</h3>
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{wsUrl}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CreateProjectForm
              wsUrl={wsUrl}
              open={openCreateProjectForm}
              setOpen={setOpenCreateProjectForm}
              updateProjectList={updateProjectList}
              setEditorText={setEditorText}
            />
          </AccordionDetails>
          {projectList.map((projectdata) => {
            return (
              <AccordionDetails>
                <ProjectLink
                  wsUrl={wsUrl}
                  projectData={projectdata}
                  setReferenceList={setReferenceList}
                  setSourceCodeList={setSourceCodeList}
                  deleteProjectList={deleteProjectList}
                  setSelectedProject={setSelectedProject}
                  setSelectedReference={setSelectedReference}
                />
              </AccordionDetails>
            );
          })}
        </Accordion>
      </div>
      <Divider />
      <div>
        <h3>Reference List</h3>
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
              wsUrl={wsUrl}
              open={openCreateReferenceForm}
              selectedProject={selectedProject}
              setOpen={setOpenCreateReferenceForm}
              updateReferenceList={updateReferenceList}
              setEditorText={setEditorText}
            />
          </AccordionDetails>
          {referenceList.map((filedata) => {
            return (
              <RefernceLink
                wsUrl={wsUrl}
                referenceData={filedata}
                setSourceCodeList={setSourceCodeList}
                setSelectedReference={setSelectedReference}
              />
            );
          })}
        </Accordion>
      </div>
      <Divider />
      <div>
        <h3>Source Code List</h3>
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>
              {selectedReference.name
                ? selectedReference.name
                : "Select Project, please"}
            </Typography>
          </AccordionSummary>
          {sourceCodeList.map((sourceCodeData) => {
            return (
              <SourceCodeLink
                wsUrl={wsUrl}
                sourceCodeData={sourceCodeData}
                setEditorText={setEditorText}
              />
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

type LNBProps = {
  wsUrl?: string;
  setEditorText?: Function;
};
