import * as React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import WorkspaceStore from '../../stores/workspaceStore';
import { Observer, observer } from 'mobx-react';
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { sendMessage } from '../../utils/service-utils';
import FileTreeView, { getFolderStructure } from './FileTreeView';
import { Box } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import EditorContentsStore from '../../stores/editorContentsStore';
import ReactMarkdown from 'react-markdown';

const ProjectDetailPage: React.FC = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [readme, setReadme] = React.useState('');

  React.useEffect(() => {
    const newPath = location.pathname
      .replace(`/projects/${projectName}/details`, '')
      .split('/')
      .filter((part) => part.length > 0);
    setCurrentPath(newPath);
  }, [location.pathname]);

  React.useEffect(() => {
    WorkspaceStore.updateCurrentCommitAction({});
    WorkspaceStore.updateSourceCodeListAction([]);
    WorkspaceStore.updateCurrentProjectAction({ name: projectName });
    sendMessage('reference', 'ListService', {
      proj_name: projectName,
    });
  }, []);
  React.useEffect(() => {
    if (
      WorkspaceStore.currentCommit.commitId &&
      WorkspaceStore.commitList.length
    ) {
      sendMessage('commit', 'DetailService', {
        commit_id: WorkspaceStore.currentCommit.commitId,
      });
    }
  }, [WorkspaceStore.currentCommit.commitId]);
  React.useEffect(() => {
    EditorContentsStore.initContentAction();
    if (WorkspaceStore.sourceCodeList.length) {
      WorkspaceStore.sourceCodeList.map((sourceCode) => {
        const lastSlashIndex = sourceCode.srcPath.lastIndexOf('/');
        const result = sourceCode.srcPath.slice(lastSlashIndex + 1);
        if (result === 'README.md') {
          sendMessage('source', 'DetailService', {
            src_id: sourceCode.srcId,
            commit_id: sourceCode.commitId,
          });
        }
      });
    }
  }, [WorkspaceStore.sourceCodeList]);
  React.useEffect(() => {
    if (
      EditorContentsStore.contents[EditorContentsStore.viewIndex].path.includes(
        'README.md',
      )
    ) {
      setReadme(
        EditorContentsStore.contents[EditorContentsStore.viewIndex].content,
      );
    } else {
      setReadme('');
    }
  }, [EditorContentsStore.viewIndex]);

  const folderStructure = getFolderStructure(WorkspaceStore.sourceCodeList);

  const [currentPath, setCurrentPath] = React.useState([]);
  const handleBack = () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      navigate(newPath.join('/'));
    }
  };

  const [referenceId, setReferenceId] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setReferenceId(event.target.value);
  };
  React.useEffect(() => {
    referenceId &&
      WorkspaceStore.referenceList.map((reference) => {
        if (Number(referenceId) === reference.refId) {
          WorkspaceStore.updateCurrentReferenceAction(reference);
          sendMessage('reference', 'DetailService', {
            proj_name: WorkspaceStore.currentProject.name,
            ref_name: reference.name,
          });
          EditorContentsStore.initContentAction();
        }
      });
  }, [referenceId]);
  const [action, setAction] = React.useState('');

  const handleActionChange = (event: SelectChangeEvent) => {
    setAction(event.target.value);
  };
  const [showModal, setShowModal] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCreateModal = () => {
    window.location.hash = `/projects/${projectName}/editor`;
    EditorContentsStore.updateContentAction(inputValue, '');
    setShowModal(false);
    setInputValue('');
  };
  const handleCancelModal = () => {
    setShowModal(false);
    setInputValue('');
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const menus = [
    'Details',
    'Issues',
    'Merge Requests',
    'CI/CD Report',
    'Settings',
    'PX Analysis',
  ];
  return (
    <div>
      <div className="gnb-project-page">
        {menus.map((menu) => {
          return (
            <span key={`menu-All`}>
              <Button
                className="gnb-menu-button"
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                // onClick={handleClick}
                // value={menu}
              >
                {menu}
              </Button>
            </span>
          );
        })}
      </div>
      <div className="detail-body">
        <div className="detail-main">
          <div className="detail-in-flex">
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                borderRadius: '20%',
                top: '20px',
                width: '80px',
                height: '80px',
                fontSize: '3.25rem',
              }}
            >
              {projectName.charAt(0)}
            </Avatar>
            <div>
              <h1>{projectName}</h1>
              <p>Project ID: {WorkspaceStore.currentReference.projId}</p>
            </div>
          </div>
          <div className="detail-in-flex">
            <Button variant="outlined">HISTORY</Button>
            <Button variant="contained" href={`projects/${projectName}/editor`}>
              PX Editor
            </Button>
            <Button variant="contained">CI/CD</Button>
          </div>
        </div>
        <Observer>
          {() => (
            <>
              <div className="detail-in-flex-under">
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    borderRadius: '20%',
                    top: '15px',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.25rem',
                  }}
                >
                  {'IC'}
                </Avatar>
                <p>Add license</p>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    borderRadius: '20%',
                    top: '15px',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.25rem',
                  }}
                >
                  {'IC'}
                </Avatar>
                <p>{WorkspaceStore.commitList.length} Commits</p>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    borderRadius: '20%',
                    top: '15px',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.25rem',
                  }}
                >
                  {'IC'}
                </Avatar>
                <p>
                  {
                    WorkspaceStore.referenceList.filter(
                      (item) => item.type === 0,
                    ).length
                  }{' '}
                  Branches
                </p>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    borderRadius: '20%',
                    top: '15px',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.25rem',
                  }}
                >
                  {'IC'}
                </Avatar>
                <p>
                  {
                    WorkspaceStore.referenceList.filter(
                      (item) => item.type !== 0,
                    ).length
                  }{' '}
                  Tags
                </p>
              </div>
              <div className="detail-drop-down">
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small">reference</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={referenceId}
                    label="reference"
                    onChange={handleChange}
                  >
                    {WorkspaceStore.referenceList.length &&
                      WorkspaceStore.referenceList.map((workReference) => {
                        return (
                          <MenuItem value={workReference.refId}>
                            <em>{workReference.name}</em>
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                <div>{currentPath.join('/')}</div>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small">action</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={action}
                    label="action"
                    onChange={handleActionChange}
                  >
                    <MenuItem value={'Add file'} onClick={handleOpenModal}>
                      Add file
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <Box>
                {currentPath.length > 0 && (
                  <Box mb={1}>
                    <Button onClick={handleBack}>{`../`}</Button>
                  </Box>
                )}

                <FileTreeView
                  structure={folderStructure}
                  currentPath={currentPath}
                  onClick={(path) => {
                    setCurrentPath(path);
                    navigate(`${path.join('/')}`);
                  }}
                />
              </Box>
            </>
          )}
        </Observer>
        <Dialog open={showModal} onClose={handleCancelModal}>
          <DialogTitle> File name</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter a file name</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="file name"
              type="email"
              fullWidth
              variant="standard"
              value={inputValue}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelModal}>Cancel</Button>
            <Button onClick={handleCreateModal}>Create</Button>
          </DialogActions>
        </Dialog>
        <div className="markdown-container">
          <ReactMarkdown>{readme}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default observer(ProjectDetailPage);
