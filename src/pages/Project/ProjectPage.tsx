import * as React from 'react';
import { observer, Observer } from 'mobx-react';
import { Link, useParams } from 'react-router-dom';
import WorkspaceStore from '../../stores/workspaceStore';
import { sendMessage } from '../../utils/service-utils';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TableHead,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

const StyledTableCell = styled(TableCell)({
  textAlign: 'center',
  verticalAlign: 'middle',
});

const ProjectPage: React.FC = () => {
  React.useEffect(() => {
    sendMessage('project', 'ListService', {});
  }, []);
  const { projectName } = useParams();

  const [projectList, setProjectList] = React.useState([]);
  React.useEffect(() => {
    setProjectList(
      WorkspaceStore.projectList.sort((a, b) => a.name.localeCompare(b.name)),
    );
  }, [WorkspaceStore.projectList]);

  const [searchInput, setSearchInput] = React.useState('');
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };
  const [action, setAction] = React.useState('Name');
  const handleActionChange = (event) => {
    setAction(event.target.value);
  };
  React.useEffect(() => {
    if (action === 'Name') {
      const newData = WorkspaceStore.projectList.filter((d) =>
        d.name.toLowerCase().includes(searchInput.toLowerCase()),
      );
      setProjectList(newData);
    }
  }, [searchInput, action]);
  const { t } = useTranslation();
  return (
    <Observer>
      {() => (
        <div className="project-page-parent">
          <div className="gnb-project-page">
            <span key={`menu-All`}>
              <Button
                className="gnb-menu-button"
                id="basic-button"
                // aria-controls={open ? 'basic-menu' : undefined}
                // aria-haspopup="true"
                // aria-expanded={open ? 'true' : undefined}
                // // onClick={handleClick}
                // value={menu}
              >
                {'All'}
              </Button>
            </span>
            <span key={`menu-Favorites`}>
              <Button
                className="gnb-menu-button"
                id="basic-button"
                // aria-controls={open ? 'basic-menu' : undefined}
                // aria-haspopup="true"
                // aria-expanded={open ? 'true' : undefined}
                // onClick={handleClick}
                // value={menu}
              >
                {'Favorites'}
              </Button>
            </span>
          </div>
          <div className="project-page">
            <div className="project-page-create">
              <h1>{t('PROJECTMAIN')}</h1>
              <div className="padding-top-new-pro">
                <Button
                  variant="contained"
                  href={
                    projectName ? `/projects/${projectName}/create` : '/create'
                  }
                >
                  New Project
                </Button>
              </div>
            </div>
            <div className="project-page-search">
              <TextField
                label="Search a project"
                variant="outlined"
                value={searchInput}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
                sx={{ m: 1, minWidth: 120 }}
              ></TextField>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small">unit</InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={action}
                  label="Unit"
                  onChange={handleActionChange}
                >
                  <MenuItem value={'Name'} onClick={() => {}}>
                    Name
                  </MenuItem>
                  <MenuItem value={'Favorite'} onClick={() => {}}>
                    Favorite
                  </MenuItem>
                  <MenuItem value={'Last updated'} onClick={() => {}}>
                    Last updated
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <TableContainer component={Paper}>
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>

              <Table sx={{ minWidth: 650 }} size="small">
                <TableBody>
                  {projectList.map((project) => (
                    <TableRow key={`project-${project.projId}`}>
                      <StyledTableCell
                        onClick={() => {
                          WorkspaceStore.updateCurrentProjectAction(project);
                          sendMessage('reference', 'ListService', {
                            proj_name: project.name,
                          });
                        }}
                      >
                        <Link to={`/projects/${project.name}/details`}>
                          <Box sx={{ p: 2 }}>
                            <Paper variant="outlined">
                              <Link to={`/projects/${project.name}/details`}>
                                <Box sx={{ display: 'flex' }}>
                                  <Box sx={{ p: 2 }}>
                                    <Avatar
                                      sx={{
                                        bgcolor: 'primary.main',
                                        borderRadius: '20%',
                                      }}
                                    >
                                      {project.name.charAt(0)}
                                    </Avatar>
                                  </Box>
                                  <Box sx={{ p: 2 }}>
                                    <div>
                                      <b>{project.name}</b>
                                    </div>
                                    <div>{project.name}</div>
                                  </Box>
                                </Box>
                              </Link>
                            </Paper>
                          </Box>
                        </Link>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      )}
    </Observer>
  );
};
export default observer(ProjectPage);
