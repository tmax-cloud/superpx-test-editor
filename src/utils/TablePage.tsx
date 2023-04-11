import {
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
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import Table from '@mui/material/Table';
import TablePagination from '@mui/material/TablePagination';

interface TablePageProps {
  itemList: any[];
  setItemList: (list: any[]) => void;
  InnerComponent: any;
  TableHeader?: any;
  mainName: string;
  TableButton?: ReactElement;
  rawProjectList: any[];
  cellClickFuntion: any;
  type: 'project' | 'commit' | 'CICD';
}

const StyledTableCell = styled(TableCell)({
  textAlign: 'center',
  verticalAlign: 'middle',
});

const TablePage = (props: TablePageProps) => {
  const {
    itemList,
    setItemList,
    InnerComponent,
    TableHeader,
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
      const newData =
        type === 'project'
          ? rawProjectList.filter((d) =>
              d.name.toLowerCase().includes(searchInput.toLowerCase()),
            )
          : type === 'commit'
          ? rawProjectList.filter((d) =>
              d.message?.toLowerCase().includes(searchInput.toLowerCase()),
            )
          : type === 'CICD'
          ? rawProjectList.filter((d) =>
              String(d.cicdId)
                ?.toLowerCase()
                .includes(searchInput.toLowerCase()),
            )
          : [];
      setItemList(newData);
    }
  }, [searchInput, action]);

  return (
    <div className="project-page">
      <div className="project-page-create">
        <h1>{mainName}</h1>
        {TableButton && (
          <div className="padding-top-new-pro">{TableButton}</div>
        )}
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
        <TableHead sx={{ width: '100%' }}>
          <TableRow>{TableHeader && <TableHeader />}</TableRow>
        </TableHead>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableBody>
            {itemList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => {
                return (
                  <TableRow key={`project-${item.projId}`}>
                    <StyledTableCell
                      onClick={() => {
                        cellClickFuntion(item);
                      }}
                    >
                      <Paper variant="outlined">{InnerComponent(item)}</Paper>
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
