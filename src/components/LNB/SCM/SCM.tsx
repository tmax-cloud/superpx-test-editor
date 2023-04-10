import * as React from 'react';
import { ReferenceLink } from '../ReferenceLink';
import { CommitLink } from '../CommitLink';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import { CreateReferenceForm } from '../../Form/CreateReferenceForm';
import WorkspaceStore from '../../../stores/workspaceStore';
import { Observer } from 'mobx-react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { sendMessage } from '../../../utils/service-utils';

export const SCM: React.FC = () => {
  const [openCreateReferenceForm, setOpenCreateReferenceForm] =
    React.useState(false);

  const [commitMessage, setCommitMessage] = React.useState('');
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
    setCommitMessage('');
  };

  return (
    <div className="editor-lnb-drawer">
      <TextField
        margin="dense"
        id="name"
        label="Commit Message"
        type="text"
        fullWidth
        variant="standard"
        onChange={onCommitMessageChange}
        placeholder="Enter Commit Message"
        value={commitMessage}
      />
      <Button variant="outlined" onClick={onCommitClick}>
        Commit
      </Button>
      <div>
        <Observer>
          {() => (
            <Accordion defaultExpanded={false}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                  Reference(
                  {WorkspaceStore.currentReference.name
                    ? WorkspaceStore.currentReference.name
                    : 'Select Project, please'}
                  )
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
        <Observer>
          {() => (
            <Accordion defaultExpanded={false}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                  Commit(
                  {WorkspaceStore.currentCommit.message
                    ? WorkspaceStore.currentCommit.message
                    : 'Select Project, please'}
                  )
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
