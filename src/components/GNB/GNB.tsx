import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import HomeIcon from '@mui/icons-material/Home';

export const GNB = () => {
  const menus = [
    'file',
    'edit',
    'select',
    'view',
    'goto',
    'debug',
    'terminal',
    'help',
  ];
  const menusAction = {
    file: ['Import Directory', 'Import File'],
    edit: ['editAction1', 'editAction2'],
    select: ['selectAction1', 'selectAction2'],
    view: ['viewAction1', 'viewAction2'],
    goto: ['gotoAction1', 'gotoAction2'],
    debug: ['debugAction1', 'debugAction2'],
    terminal: ['terminalAction1', 'terminalAction2'],
    help: ['helpAction1', 'helpAction2'],
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = React.useState({});
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenMenu({ [event.currentTarget.value]: true });
    setAnchorEl(event.currentTarget);
  };
  const getActions = (action) => {
    switch (action) {
      case 'Import Directory':
        return handleImportDiretory;
      case 'Import File':
        return handleImportFile;
      default:
        return handleClose;
    }
  };
  const handleImportDiretory = () => {
    alert('Import Directory');
    setOpenMenu({});
    setAnchorEl(null);
  };
  const handleImportFile = () => {
    alert('Import File');
    setOpenMenu({});
    setAnchorEl(null);
  };
  const handleClose = () => {
    setOpenMenu({});
    setAnchorEl(null);
  };
  return (
    <div className="gnb">
      <div className="logo">
        <HomeIcon className="logo-icon" sx={{ color: '#FF7575' }} />
        <p className="logo-text">SuperPX</p>
      </div>
      <div>
        {menus.map((menu) => {
          return (
            <span key={`menu-${menu}`}>
              <Button
                className="gnb-menu-button"
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                value={menu}
              >
                {menu}
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu[menu]}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {menusAction[menu].map((action) => {
                  return (
                    <MenuItem
                      key={`menuItem-${action}`}
                      onClick={getActions(action)}
                    >
                      {action}
                    </MenuItem>
                  );
                })}
              </Menu>
            </span>
          );
        })}
      </div>
    </div>
  );
};
