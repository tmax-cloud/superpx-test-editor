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

export const LNB: React.FC<LNBProps> = ({ wsUrl, setEditorText }) => {
  const [projectList, setProjectList] = React.useState([]);
  const [referenceList, setReferenceList] = React.useState([]);
  const [showReferenceList, setShowReferenceList] = React.useState(true);
  const [sourceCodeList, setSourceCodeList] = React.useState([]);
  const [showOpenSouceCodeList, setShowOpenSouceCodeList] =
    React.useState(true);

  const [openCreateProjectForm, setOpenCreateProjectForm] =
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
  const deleteProjectList = (projId) => {
    setProjectList(projectList.filter((p) => p.projId != projId));
  };

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
        <Divider />
        <h3>ProjectList</h3>
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
              projectList={projectList}
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
                />
              </AccordionDetails>
            );
          })}
        </Accordion>
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
