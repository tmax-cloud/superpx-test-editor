import * as React from 'react';
import * as _ from 'lodash';
import Button from '@mui/material/Button';
import EditorContentsStore from '../../stores/editorContentsStore';
import Drawer from '@mui/material/Drawer';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SearchIcon from '@mui/icons-material/Search';
import CommitIcon from '@mui/icons-material/Commit';
import BugReportIcon from '@mui/icons-material/BugReport';
import ExtensionIcon from '@mui/icons-material/Extension';
import { styled } from '@mui/material/styles';
import { sendMessage } from '../../utils/service-utils';
import { Explorer } from './Explorer/Explorer';
import { SCM } from './SCM/SCM';

type Lnb = 'explorer' | 'search' | 'scm' | 'debug' | 'extension';

export const EditorLNB: React.FC = () => {
  const [lnbOpenState, setLnbOpenState] = React.useState(
    EditorContentsStore.editorLnbInitState,
  );
  React.useEffect(() => {
    Object.keys(lnbOpenState).every((key) => lnbOpenState[key] === false)
      ? EditorContentsStore.updateIsFull(true)
      : EditorContentsStore.isFull && EditorContentsStore.updateIsFull(false);
  }, [lnbOpenState]);
  const lnbIcon = {
    explorer: <LibraryBooksIcon />,
    search: <SearchIcon />,
    scm: <CommitIcon />,
    debug: <BugReportIcon />,
    extension: <ExtensionIcon />,
  };
  const toggleDrawer =
    (lnb: Lnb) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      if (lnbOpenState[lnb]) {
        setLnbOpenState({
          explorer: false,
          search: false,
          scm: false,
          debug: false,
          extension: false,
        });
      } else {
        setLnbOpenState(
          _.merge(
            {
              explorer: false,
              search: false,
              scm: false,
              debug: false,
              extension: false,
            },
            { [lnb]: true },
          ),
        );
      }
    };

  React.useEffect(() => {
    sendMessage('project', 'ListService', {});
  }, []);

  const MyDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiPaper-root': {
      overflowX: 'hidden',
    },
  }));

  return (
    <div className="editor-lnb">
      <MyDrawer
        variant="permanent"
        sx={{
          width: 50,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 65,
            boxSizing: 'border-box',
            background: '#F5F7F9',
            marginTop: '72px',
          },
        }}
      >
        {(['explorer', 'search', 'scm', 'debug', 'extension'] as const).map(
          (lnb) => (
            <Button
              id={`lnb-${lnb}`}
              onClick={toggleDrawer(lnb)}
              className="lnb-btn"
            >
              {lnbIcon[lnb]}
            </Button>
          ),
        )}
        {(['explorer', 'search', 'scm', 'debug', 'extension'] as const).map(
          (lnb) => (
            <>
              <Drawer
                sx={{
                  width: 300,
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: {
                    width: 300,
                    boxSizing: 'border-box',
                  },
                  zIndex: 0,
                }}
                anchor="left"
                open={lnbOpenState[lnb]}
                onClose={toggleDrawer(lnb)}
                variant="persistent"
              >
                {lnb === 'explorer' && <Explorer />}
                {lnb === 'search' && <div className="editor-lnb-drawer"></div>}
                {lnb === 'scm' && <SCM />}
                {lnb === 'debug' && <div className="editor-lnb-drawer"></div>}
                {lnb === 'extension' && (
                  <div className="editor-lnb-drawer"></div>
                )}
              </Drawer>
            </>
          ),
        )}
      </MyDrawer>
    </div>
  );
};
