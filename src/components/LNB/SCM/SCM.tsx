import * as React from 'react';
import { ProjectLink } from '../ProjectLink';
import { ReferenceLink } from '../ReferenceLink';
import { CommitLink } from '../CommitLink';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import { CreateProjectForm } from '../../Form/CreateProjectForm';
import { CreateReferenceForm } from '../../Form/CreateReferenceForm';
import WorkspaceStore from '../../../stores/workspaceStore';
import { Observer } from 'mobx-react';
import { wsUrl } from '../../../utils/constants';

export const SCM: React.FC = () => {
  const [openCreateProjectForm, setOpenCreateProjectForm] =
    React.useState(false);
  const [openCreateReferenceForm, setOpenCreateReferenceForm] =
    React.useState(false);

  return (
    <div className="lnb">
      <div>
        <h3 className="list-title">Project List</h3>
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
              open={openCreateProjectForm}
              setOpen={setOpenCreateProjectForm}
            />
          </AccordionDetails>
          <Observer>
            {() => (
              <>
                {WorkspaceStore.projectList.map((project) => {
                  return (
                    <ProjectLink
                      key={`project-${project.projId}`}
                      project={project}
                    />
                  );
                })}
              </>
            )}
          </Observer>
        </Accordion>
      </div>
      <Divider />
      <div>
        <h3 className="list-title">Reference List</h3>
        <Observer>
          {() => (
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                  {WorkspaceStore.currentProject.name
                    ? WorkspaceStore.currentProject.name
                    : 'Select Project, please'}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CreateReferenceForm
                  open={openCreateReferenceForm}
                  setOpen={setOpenCreateReferenceForm}
                />
              </AccordionDetails>
              {WorkspaceStore.referenceList.map((reference) => {
                return (
                  <ReferenceLink
                    key={`project-${reference.refId}`}
                    reference={reference}
                  />
                );
              })}
            </Accordion>
          )}
        </Observer>
      </div>
      <Divider />
      <div>
        <h3 className="list-title">Commit List</h3>
        <Observer>
          {() => (
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                  {WorkspaceStore.currentReference.name
                    ? WorkspaceStore.currentReference.name
                    : 'Select Project, please'}
                </Typography>
              </AccordionSummary>
              {WorkspaceStore.commitList.map((commit) => {
                return (
                  <CommitLink
                    key={`commit-${commit.commitId}`}
                    commit={commit}
                  />
                );
              })}
            </Accordion>
          )}
        </Observer>
      </div>
    </div>
  );
};
