import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useParams } from 'react-router-dom';
import I18nButton from '../../utils/i18n/I18nButton';
import { Chip } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import WorkspaceStore from '../../stores/workspaceStore';

export const GNB = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const [openSelectProject, setOpenSelectProject] = React.useState(false);
  const [selectProject, setSelectProject] = React.useState('');
  const handleClose = () => {
    setOpenSelectProject(false);
  };

  const onProjectNameChange = (event) => {
    setSelectProject(event.target.value);
    navigate(`/projects/${event.target.value}`);
  };

  return (
    <div className="gnb">
      <div className="logo">
        <Link to="/">
          <HomeIcon className="logo-icon" sx={{ color: '#FF7575' }} />
          <p className="logo-text">SuperPX</p>
        </Link>
        <Link to={`/projects`}>
          <p className="top-menu-text-left">Projects</p>
        </Link>
        {/* <Link to="/groups">
          <p className="top-menu-text">Groups</p>
        </Link> */}
        <Link
          to={`/projects/${projectName}/details`}
          className={`top-menu-link ${!projectName ? 'disabled' : ''}`}
        >
          <p className="top-menu-text">PX Manager</p>
        </Link>

        <Link
          to={`/projects/${projectName}/editor`}
          className={`top-menu-link ${!projectName ? 'disabled' : ''}`}
        >
          <p className="top-menu-text">PX Editor</p>
        </Link>
      </div>
      {projectName && (
        <div
          className="top-head-text"
          onClick={() => setOpenSelectProject(true)}
        >
          <div>{projectName}</div>
          <Chip
            label="Public"
            variant="outlined"
            sx={{
              color: '#ffffff',
              height: '18px',
              borderColor: 'currentColor',
              '& .MuiChip-label': {
                fontSize: '0.8rem',
              },
            }}
          />
        </div>
      )}
      <I18nButton />
      <Dialog open={openSelectProject} onClose={handleClose}>
        <DialogTitle>Select Project</DialogTitle>
        <DialogContent>
          <DialogContentText>Select Project</DialogContentText>
          <FormControl sx={{ minWidth: 300, paddingTop: '30px' }}>
            <InputLabel sx={{ minWidth: 300, paddingTop: '30px' }}>
              Project Name
            </InputLabel>
            <Select
              value={selectProject}
              label="Project Name"
              onChange={onProjectNameChange}
            >
              {WorkspaceStore.projectList.map((project) => {
                return <MenuItem value={project.name}>{project.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </DialogContent>
      </Dialog>
    </div>
  );
};
