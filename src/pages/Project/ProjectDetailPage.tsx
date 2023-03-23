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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickBtn = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
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
              <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClickBtn}
                endIcon={<KeyboardArrowDownIcon />}
              >
                main
              </Button>
              <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClickBtn}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Add file
              </Button>
            </div>
            <Box>
              {currentPath.length > 0 && (
                <Box mb={1}>
                  <Button onClick={handleBack}>{`< Back`}</Button>
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
