import * as React from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import WorkspaceStore from '../../stores/workspaceStore';
import { Observer, observer } from 'mobx-react';
import { Avatar } from '@mui/material';
import { sendMessage } from '../../utils/service-utils';
import { toJS } from 'mobx';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FileTreeView from './FileTreeView';

const ProjectDetailPage: React.FC = () => {
  const { projectName } = useParams();

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
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
              <p>{WorkspaceStore.referenceList.length} Branches</p>
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
              <p>Tags</p>
            </div>
            <div className="detail-drop-down">
              <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
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
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Add file
              </Button>
            </div>
            {/* {WorkspaceStore.sourceCodeList?.length && (
              <div>
                <FileTreeView sourceCodeList={WorkspaceStore.sourceCodeList} />
              </div>
            )} */}
          </>
        )}
      </Observer>
    </div>
  );
};

export default observer(ProjectDetailPage);
