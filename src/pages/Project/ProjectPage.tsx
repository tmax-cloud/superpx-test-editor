import * as React from 'react';
import { Observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { CreateProjectForm } from '../../components/Form/CreateProjectForm';
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
import { TableHead } from '@mui/material';

const StyledTableCell = styled(TableCell)({
  textAlign: 'center',
  verticalAlign: 'middle',
});

const ProjectPage: React.FC = () => {
  const [openCreateProjectForm, setOpenCreateProjectForm] =
    React.useState(false);
  React.useEffect(() => {
    sendMessage('project', 'ListService', {});
  }, []);

  return (
    <Observer>
      {() => (
        <div className="project-page-parent">
          <div className="project-page">
            <div className="project-page-create">
              <CreateProjectForm
                open={openCreateProjectForm}
                setOpen={setOpenCreateProjectForm}
              />
            </div>
            <TableContainer component={Paper}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    <h1>Project List</h1>
                  </StyledTableCell>
                </TableRow>
              </TableHead>

              <Table sx={{ minWidth: 650 }} size="small">
                <TableBody>
                  {WorkspaceStore.projectList.map((project) => (
                    <TableRow key={`project-${project.projId}`}>
                      <StyledTableCell>
                        <Link to={`/projects/${project.name}`}>
                          <Box sx={{ p: 2 }}>
                            <Paper variant="outlined">
                              <Link to={`/projects/${project.name}`}>
                                <Box sx={{ display: 'flex' }}>
                                  <Box sx={{ p: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
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

export default ProjectPage;
