import * as React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import WorkspaceStore from '../../stores/workspaceStore';
import { Observer, observer } from 'mobx-react';
import { Avatar } from '@mui/material';
import { sendMessage } from '../../utils/service-utils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FileTreeView, { getFolderStructure } from './FileTreeView';
import { Box } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import EditorContentsStore from '../../stores/editorContentsStore';

const ProjectDetailPage: React.FC = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    WorkspaceStore.updateCurrentProjectAction({ name: projectName });
    sendMessage('reference', 'ListService', {
      proj_name: projectName,
    });
  }, []);
  React.useEffect(() => {
    if (WorkspaceStore.currentCommit.commitId) {
      sendMessage('commit', 'DetailService', {
        commit_id: WorkspaceStore.currentCommit.commitId,
      });
    }
  }, [WorkspaceStore.currentCommit.commitId]);

  const folderStructure = getFolderStructure(WorkspaceStore.sourceCodeList);

  const [currentPath, setCurrentPath] = React.useState([]);
  const handleBack = () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      navigate(newPath.join('/'));
    }
  };
  React.useEffect(() => {
    const newPath = location.pathname
      .replace(`/projects/${projectName}`, '')
      .split('/')
      .filter((part) => part.length > 0);
    setCurrentPath(newPath);
  }, [location.pathname]);

  const [commit, setCommit] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setCommit(event.target.value);
  };
  React.useEffect(() => {
    commit &&
      sendMessage('commit', 'DetailService', {
        commit_id: Number(commit),
      });
    EditorContentsStore.initContentAction();
    WorkspaceStore.commitList.map((cm) => {
      if (cm.commitId === Number(commit)) {
        WorkspaceStore.updateCurrentCommitAction(cm);
      }
    });
  }, [commit]);
  const [action, setAction] = React.useState('');

  const handleActionChange = (event: SelectChangeEvent) => {
    setAction(event.target.value);
  };
  return (
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
          <Button variant="contained" href={`#/projects/${projectName}/editor`}>
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
                  WorkspaceStore.referenceList.filter((item) => item.type === 0)
                    .length
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
                  WorkspaceStore.referenceList.filter((item) => item.type !== 0)
                    .length
                }{' '}
                Tags
              </p>
            </div>
            <div className="detail-drop-down">
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small">commit</InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={commit}
                  label="commit"
                  onChange={handleChange}
                >
                  {WorkspaceStore.commitList.length &&
                    WorkspaceStore.commitList.map((workCommit) => {
                      return (
                        <MenuItem value={workCommit.commitId}>
                          <em>{workCommit.message}</em>
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
                  <MenuItem value={'Add file'}>Add file</MenuItem>
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
    </div>
  );
};

export default observer(ProjectDetailPage);
