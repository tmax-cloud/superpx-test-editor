import * as React from 'react';
import * as _ from 'lodash';
import { ProjectLink } from './ProjectLink';
import { ReferenceLink } from './ReferenceLink';
import { CommitLink } from './CommitLink';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import { CreateProjectForm } from '../Form/CreateProjectForm';
import { CreateReferenceForm } from '../Form/CreateReferenceForm';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import EditorContentsStore from '../../stores/editorContentsStore';
import WorkspaceStore from '../../stores/workspaceStore';
import Drawer from '@mui/material/Drawer';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SearchIcon from '@mui/icons-material/Search';
import CommitIcon from '@mui/icons-material/Commit';
import BugReportIcon from '@mui/icons-material/BugReport';
import ExtensionIcon from '@mui/icons-material/Extension';
import { SourceCodeTree } from './SourceCodeTree';
import { styled } from '@mui/material/styles';
import { sendMessage } from '../../utils/service-utils';
import { Observer } from 'mobx-react';
import { wsUrl } from '../../utils/constants';

type Lnb = 'explorer' | 'search' | 'scm' | 'debug' | 'extension';

export const LNB: React.FC = () => {
  const [referenceList, setReferenceList] = React.useState([]);
  const [commitList, setCommitList] = React.useState([]);
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
  React.useEffect(() => {
    Object.keys(lnbOpenState).every((key) => lnbOpenState[key] === false)
      ? EditorContentsStore.updateIsFull(true)
      : EditorContentsStore.isFull && EditorContentsStore.updateIsFull(false);
  }, [lnbOpenState]);

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
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setLnbOpenState(
        _.merge(
          {
            explorer: false,
            search: false,
            scm: false,
            debug: false,
            extension: false,
          },
          { [lnb]: open },
        ),
      );
    };

  React.useEffect(() => {
    sendMessage('project', 'ListService', {});
  }, []);
  const updateReferenceList = (reference) => {
    const tempReferenceList = referenceList;
    tempReferenceList.push(reference);
    setReferenceList(tempReferenceList);
  };

  const [newFilePath, setNewFilePath] = React.useState('');

  const onSourcePathChange = (event) => {
    setNewFilePath(event.target.value);
  };

  const onAddSourceCodeClick = () => {
    EditorContentsStore.updateContentAction(newFilePath, '');
  };

  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute('webkitdirectory', '');
    }
  }, [ref]);

  const onFileChange = (e) => {
    const files = e.target.files;
    for (const file of files) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        EditorContentsStore.pushContentAction(
          file.webkitRelativePath,
          fileReader.result as string,
        );
      };
      fileReader.readAsText(file);
    }
  };

  const MyDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiPaper-root': {
      overflowX: 'hidden',
    },
  }));

  return (
    <div className="lnb">
      <MyDrawer
        variant="permanent"
        sx={{
          width: 50,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 65,
            boxSizing: 'border-box',
            background: '#F5F7F9',
            marginTop: 10,
          },
        }}
      >
        {(['explorer', 'search', 'scm', 'debug', 'extension'] as const).map(
          (lnb) => (
            <Button
              id={`lnb-${lnb}`}
              onClick={toggleDrawer(lnb, true)}
              className="lnb-btn"
            >
              {lnbIcon[lnb]}
            </Button>
          ),
        )}
        {(['explorer', 'search', 'scm', 'debug', 'extension'] as const).map(
          (lnb) => (
            <>
              <Drawer
                sx={{
                  width: 300,
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: {
                    width: 300,
                    boxSizing: 'border-box',
                  },
                  zIndex: 0,
                }}
                anchor="left"
                open={lnbOpenState[lnb]}
                onClose={toggleDrawer(lnb, false)}
                variant="persistent"
              >
                <Button onClick={toggleDrawer(lnb, false)}>
                  <CloseIcon className="lnb-close-icon" />
                </Button>

                {lnb === 'scm' && (
                  <div className="lnb-scm">
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
                                wsUrl={wsUrl}
                                open={openCreateReferenceForm}
                                selectedProject={WorkspaceStore.currentProject}
                                setOpen={setOpenCreateReferenceForm}
                                updateReferenceList={updateReferenceList}
                              />
                            </AccordionDetails>
                            {WorkspaceStore.referenceList.map(
                              (referenceData) => {
                                return (
                                  <ReferenceLink
                                    key={`project-${referenceData.refId}`}
                                    wsUrl={wsUrl}
                                    referenceData={referenceData}
                                    setCommitList={setCommitList}
                                  />
                                );
                              },
                            )}
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
                            {WorkspaceStore.commitList.map((commitData) => {
                              return (
                                <CommitLink
                                  key={`commit-${commitData.commitId}`}
                                  wsUrl={wsUrl}
                                  commitData={commitData}
                                />
                              );
                            })}
                          </Accordion>
                        )}
                      </Observer>
                    </div>
                  </div>
                )}
                {lnb === 'extension' && <div className="lnb-scm"></div>}
                {lnb === 'debug' && (
                  <div className="lnb-scm">
                    <input
                      ref={ref}
                      type="file"
                      onChange={onFileChange}
                      multiple={true}
                      accept=".java"
                    />
                  </div>
                )}
                {lnb === 'explorer' && (
                  <div className="lnb-scm">
                    <div>
                      <h3 className="list-title">Source Code List</h3>
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
                        <SourceCodeTree />
                      </Accordion>
                    </div>
                  </div>
                )}
              </Drawer>
            </>
          ),
        )}
      </MyDrawer>
    </div>
  );
};
