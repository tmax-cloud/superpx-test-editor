import {
  Avatar,
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import Table from '@mui/material/Table';
import TablePagination from '@mui/material/TablePagination';

interface TablePageProps {
  itemList: any[];
  setItemList: (list: any[]) => void;
  mainName: string;
  TableButton: ReactElement;
  rawProjectList: any[];
  cellClickFuntion: any;
  type: 'project' | 'commit';
}

const StyledTableCell = styled(TableCell)({
  textAlign: 'center',
  verticalAlign: 'middle',
});

const TablePage = (props: TablePageProps) => {
  const {
    itemList,
    setItemList,
    mainName,
    TableButton,
    rawProjectList,
    cellClickFuntion,
    type,
  } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState('');
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };
  const [action, setAction] = React.useState('Name');
  const handleActionChange = (event) => {
    setAction(event.target.value);
  };
  React.useEffect(() => {
    if (action === 'Name') {
      const newData = rawProjectList.filter((d) =>
        d.name.toLowerCase().includes(searchInput.toLowerCase()),
      );
      setItemList(newData);
    }
  }, [searchInput, action]);

  return (
    <div className="project-page">
      <div className="project-page-create">
        <h1>{mainName}</h1>
        <div className="padding-top-new-pro">{TableButton}</div>
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
            {itemList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((project) => {
                const linkTo =
                  type === 'project'
                    ? `/projects/${project.name}/details`
                    : `/projects`;
                const itemName = type === 'project' ? project.name : 'No Name';
                return (
                  <TableRow key={`project-${project.projId}`}>
                    <StyledTableCell
                      onClick={() => {
                        cellClickFuntion(project);
                      }}
                    >
                      <Link to={linkTo}>
                        <Box sx={{ p: 2 }}>
                          <Paper variant="outlined">
                            <Link to={linkTo}>
                              <Box sx={{ display: 'flex' }}>
                                <Box sx={{ p: 2 }}>
                                  <Avatar
                                    sx={{
                                      bgcolor: 'primary.main',
                                      borderRadius: '20%',
                                    }}
                                  >
                                    {itemName.charAt(0)}
                                  </Avatar>
                                </Box>
                                <Box sx={{ p: 2 }}>
                                  <div>
                                    <b>{itemName}</b>
                                  </div>
                                  <div>{itemName}</div>
                                </Box>
                              </Box>
                            </Link>
                          </Paper>
                        </Box>
                      </Link>
                    </StyledTableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={itemList.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Rows per page:"
      />
    </div>
  );
};
export default TablePage;
