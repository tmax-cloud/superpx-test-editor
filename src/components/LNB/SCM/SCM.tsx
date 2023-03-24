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
import EditorContentsStore from '../../../stores/editorContentsStore';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { sendMessage } from '../../../utils/service-utils';

export const SCM: React.FC = () => {
  const [openCreateProjectForm, setOpenCreateProjectForm] =
    React.useState(false);
  const [openCreateReferenceForm, setOpenCreateReferenceForm] =
    React.useState(false);

  const [commitMessage, setCommitMessage] = React.useState(
    'Enter Commit Message',
  );
  const onCommitMessageChange = (event) => {
    setCommitMessage(event.target.value);
  };
  const onCommitClick = () => {
    const modifiedSrc = WorkspaceStore.sourceCodeList
      .filter((s) => s.newfile || s.edited)
      .map((src) => {
        return {
          src_path: src.srcPath,
          content: src.content,
        };
      });

    const deletedSrc = WorkspaceStore.sourceCodeList
      .filter((s) => s.deleted === true)
      .map((src) => {
        return { src_path: src.srcPath };
      });

    sendMessage('commit', 'InsertService', {
      proj_name: WorkspaceStore.currentProject.name,
      ref_name: WorkspaceStore.currentReference.name,
      commit: { message: commitMessage, is_commit: true },
      modified_src: modifiedSrc,
      deleted_src: deletedSrc,
    });
  };

  return (
    <div className="editor-lnb-drawer">
      <Observer>
        {() => (
          <>
            <TextField
              margin="dense"
              id="name"
              label="Commit Message"
              type="text"
              fullWidth
              variant="standard"
              onChange={onCommitMessageChange}
            />
            <Button variant="outlined" onClick={onCommitClick}>
              Commit
              <AddIcon />
            </Button>
            {EditorContentsStore.showProjectSelect && (
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
                  {WorkspaceStore.projectList &&
                    WorkspaceStore.projectList.length > 0 &&
                    WorkspaceStore.projectList.map((project) => {
                      return (
                        <ProjectLink
                          key={`project-${project.projId}`}
                          project={project}
                        />
                      );
                    })}
                </Accordion>
                <Divider />
              </div>
            )}
          </>
        )}
      </Observer>

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
              {WorkspaceStore.referenceList &&
                WorkspaceStore.referenceList.length &&
                WorkspaceStore.referenceList.map((reference) => {
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
              {WorkspaceStore.commitList &&
                WorkspaceStore.commitList.length > 0 &&
                WorkspaceStore.commitList.map((commit) => {
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
