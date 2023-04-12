import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  SelectChangeEvent,
  Slide,
  TableCell,
  TableRow,
} from '@mui/material';
import { Observer, observer } from 'mobx-react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import WorkspaceStore from '../../stores/workspaceStore';
import { sendMessage } from '../../utils/service-utils';
import TablePage from '../../utils/TablePage';
import { CICD } from '../../utils/types';
import styled from '@emotion/styled';
import LoadingScreen from '../../components/Loading/LoadingScreen';
import loadingStore from '../../stores/loadingStore';
import { CICDMasterModal, CICDStandAloneModal } from './CICDModal';
import { ArrowDropDownCircleOutlined } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTableCell = styled(TableCell)({
  textAlign: 'center',
  verticalAlign: 'middle',
});

const StyledTableRow = styled(TableRow)({
  textAlign: 'center',
  verticalAlign: 'middle',
  display: 'flex',
  justifyContent: 'space-between',
  width: '1000px',
});

const InnerComponent = (item: CICD) => (
  <Link to={`/projects/${item.projName}/CICDDetail/${item.cicdId}`}>
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ p: 2 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            borderRadius: '20%',
          }}
        >
          {String(item.cicdId)?.charAt(0)}
        </Avatar>
      </Box>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div className="cicd-left-align">
          <b>{item.cicdId}</b>
        </div>
        <div className="cicd-left-align">{item.refName}</div>
        {item.targetIp ? (
          <div className="cicd-left-align">Master {item.targetIp}</div>
        ) : (
          <div className="cicd-left-align">Stand Alone</div>
        )}
        <div className="cicd-left-align">{item.createdTime}</div>
      </Box>
    </Box>
  </Link>
);
const TableHeader = () => {
  return (
    <StyledTableRow>
      <StyledTableCell className="cicd-left-align">CICD Id</StyledTableCell>
      <StyledTableCell className="cicd-left-align">
        Reference Name
      </StyledTableCell>
      <StyledTableCell className="cicd-left-align">Mode</StyledTableCell>
      <StyledTableCell className="cicd-left-align">
        Created Time
      </StyledTableCell>
    </StyledTableRow>
  );
};
const CICDListPage = () => {
  const { projectName } = useParams();
  const [cicdList, setCicdList] = React.useState([]);
  const menus = [
    { name: 'Details', to: `/projects/${projectName}/details` },
    { name: 'CI/CD Report', to: `/projects/${projectName}/CICDList` },
  ];
  const [referenceId, setReferenceId] = React.useState('');
  const [ciCdSelect, setCiCdSelect] = React.useState(false);
  const [masterModal, setMasterModal] = React.useState(false);
  const [targetIp, setTargetIp] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setReferenceId(event.target.value);
  };

  const handleCiCdSelectOpen = () => {
    setCiCdSelect(true);
  };
  const handleCiCdSelectClose = () => {
    setCiCdSelect(false);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    projectName &&
      sendMessage('project', 'DetailService', {
        proj_name: projectName,
      });
  }, []);
  React.useEffect(() => {
    WorkspaceStore.currentProject?.projId &&
      sendMessage(
        'service',
        'GetHistoryList',
        {
          proj_id: WorkspaceStore.currentProject.projId,
        },
        'super-px/com.tmax.buildanddeploy',
      );
    WorkspaceStore.currentProject?.projId &&
      sendMessage('reference', 'ListService', {
        proj_name: projectName,
      });
  }, [WorkspaceStore.currentProject]);

  React.useEffect(() => {
    setCicdList(
      WorkspaceStore.CICDList.sort((a, b) => {
        return String(a.cicdId).localeCompare(String(b.cicdId));
      }),
    );
  }, [WorkspaceStore.CICDList]);

  return (
    <div className="project-page-parent">
      {loadingStore.loading && <LoadingScreen />}
      <div className="gnb-project-page">
        {menus.map((menu) => {
          return (
            <span key={`menu-All-${menu.name}`}>
              <Button
                className="gnb-menu-button"
                id="basic-button"
                component={Link}
                to={menu.to}
              >
                {menu.name}
              </Button>
            </span>
          );
        })}
      </div>
      <Button
        variant="contained"
        onClick={handleClick}
        endIcon={<ArrowDropDownCircleOutlined />}
        sx={{
          position: 'absolute',
          width: '93px',
          height: '39px',
          left: '1250px',
          top: '90px',
        }}
      >
        CI/CD
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            handleCiCdSelectOpen();
          }}
        >
          Stand Alone
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            setMasterModal(true);
          }}
        >
          Master
        </MenuItem>
      </Menu>
      <CICDStandAloneModal
        ciCdSelect={ciCdSelect}
        handleCiCdSelectClose={handleCiCdSelectClose}
        referenceId={referenceId}
        handleChange={handleChange}
        projectName={projectName}
      />
      <CICDMasterModal
        masterModal={masterModal}
        setMasterModal={setMasterModal}
        Transition={Transition}
        targetIp={targetIp}
        setTargetIp={setTargetIp}
        projectName={projectName}
        referenceId={referenceId}
        handleChange={handleChange}
      />
      <Observer>
        {() => (
          <>
            <TablePage
              itemList={cicdList}
              setItemList={setCicdList}
              InnerComponent={InnerComponent}
              TableHeader={TableHeader}
              rawProjectList={WorkspaceStore.CICDList}
              mainName={'CI/CD Report'}
              cellClickFuntion={() => {}}
              type="CICD"
            />
          </>
        )}
      </Observer>
    </div>
  );
};
export default observer(CICDListPage);
