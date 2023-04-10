import * as React from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
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
  Slide,
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
import { TransitionProps } from '@mui/material/transitions';
import SmallIcon from '../../utils/SmallIcon';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProjectDetailPage: React.FC = () => {
  const { projectName, reference } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [readme, setReadme] = React.useState('');
  const folderStructure = getFolderStructure(WorkspaceStore.sourceCodeList);
  const [currentPath, setCurrentPath] = React.useState([]);
  const [referenceId, setReferenceId] = React.useState('');
  const [action, setAction] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [ciCdSelect, setCiCdSelect] = React.useState(false);
  const [masterModal, setMasterModal] = React.useState(false);
  const [targetIp, setTargetIp] = React.useState('');
  const menus = [
    'Details',
    // 'Issues',
    // 'Merge Requests',
    'CI/CD Report',
    // 'Settings',
    // 'PX Analysis',
  ];
  const handleBack = () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      navigate(newPath.join('/'));
    }
  };
  const handleChange = (event: SelectChangeEvent) => {
    setReferenceId(event.target.value);
  };
  const handleActionChange = (event: SelectChangeEvent) => {
    setAction(event.target.value);
  };
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
  const handleCiCdSelectOpen = () => {
    setCiCdSelect(true);
  };
  const handleCiCdSelectClose = () => {
    setCiCdSelect(false);
  };

  React.useEffect(() => {
    const newPath = reference
      ? location.pathname
          .replace(`/projects/${projectName}/details/${reference}`, '')
          .split('/')
          .filter((part) => part.length > 0)
      : location.pathname
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
    WorkspaceStore.currentReference.refId &&
      setReferenceId(String(WorkspaceStore.currentReference.refId));
  }, [WorkspaceStore.currentCommit.commitId]);
  React.useEffect(() => {
    EditorContentsStore.initContentAction();
    if (WorkspaceStore.sourceCodeList.length) {
      WorkspaceStore.sourceCodeList.forEach((sourceCode) => {
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
      EditorContentsStore.contents[
        EditorContentsStore.viewIndex
      ]?.path.includes('README.md')
    ) {
      setReadme(
        EditorContentsStore.contents[EditorContentsStore.viewIndex].content,
      );
    } else {
      setReadme('');
    }
  }, [EditorContentsStore.contents]);
  React.useEffect(() => {
    referenceId &&
      WorkspaceStore.referenceList.forEach((reference) => {
        if (Number(referenceId) === reference.refId) {
          WorkspaceStore.updateCurrentReferenceAction(reference);
          sendMessage('reference', 'DetailService', {
            proj_name: WorkspaceStore.currentProject.name,
            ref_name: reference.name,
          });
          EditorContentsStore.initContentAction();
          navigate(
            `/projects/${projectName}/details/${reference.name.replace(
              /\//g,
              '-',
            )}`,
          );
        }
      });
  }, [referenceId]);

  return (
    <div>
      <div className="gnb-project-page">
        {menus.map((menu) => {
          return (
            <span key={`menu-All`}>
              <Button className="gnb-menu-button" id="basic-button">
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
            <Link to={`/projects/${projectName}/commitHistory`}>
              <Button variant="outlined">HISTORY</Button>
            </Link>
            <Link to={`/projects/${projectName}/editor`}>
              <Button
                variant="contained"
                onClick={() => {
                  EditorContentsStore.initContentAction();
                }}
              >
                PX Editor
              </Button>
            </Link>
            <Link to={`/projects/${projectName}/cicdList`}>
            <Button variant="contained" onClick={handleCiCdSelectOpen}>
              CI/CD
            </Button>
            </Link>
            <Link to={`/projects`}>
              <Button
                variant="contained"
                onClick={() => {
                  sendMessage('project', 'DeleteService', {
                    proj_name: projectName,
                  });
                }}
              >
                Project Delete
              </Button>
            </Link>
          </div>
        </div>
        <Observer>
          {() => (
            <>
              <div className="detail-in-flex-under">
                <SmallIcon contents="Add license"></SmallIcon>
                <SmallIcon
                  contents={`${WorkspaceStore.commitList.length} Commits`}
                ></SmallIcon>
                <SmallIcon
                  contents={`${
                    WorkspaceStore.referenceList.filter(
                      (item) => item.type === 0,
                    ).length
                  } Branches`}
                ></SmallIcon>
                <SmallIcon
                  contents={`${
                    WorkspaceStore.referenceList.filter(
                      (item) => item.type === 1,
                    ).length
                  } Tags`}
                ></SmallIcon>
                <SmallIcon
                  contents={`${
                    WorkspaceStore.referenceList.filter(
                      (item) => item.type === 2,
                    ).length
                  } Release`}
                ></SmallIcon>
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
        <Dialog
          open={ciCdSelect}
          onClose={handleCiCdSelectClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'CI/CD'}</DialogTitle>
          <DialogContent sx={{ minWidth: 312 }}>
            <DialogContentText id="alert-dialog-description">
              Select Deploy Target mode
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleCiCdSelectClose();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleCiCdSelectClose();
                //call
              }}
            >
              Stand Alone
            </Button>
            <Button
              onClick={() => {
                handleCiCdSelectClose();
                setMasterModal(true);
              }}
            >
              Master
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={masterModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => {
            setMasterModal(false);
          }}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Master</DialogTitle>
          <DialogContent>
            <DialogContentText>Target Master SAS IP</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="Target Ip"
              label="Target Ip"
              type="text"
              fullWidth
              variant="standard"
              value={targetIp}
              onChange={(event) => {
                setTargetIp(event.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setMasterModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setMasterModal(false);
              }}
            >
              Create
            </Button>
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
