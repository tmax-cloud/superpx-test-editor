import * as React from 'react';
import * as _ from 'lodash';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
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

export const LNB: React.FC = () => {
  const [lnbOpenState, setLnbOpenState] = React.useState({
    explorer: false,
    search: false,
    scm: true,
    debug: false,
    extension: false,
  });
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
    (lnb: Lnb, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setLnbOpenState(
        _.merge(
          {
            explorer: false,
            search: false,
            scm: false,
            debug: false,
            extension: false,
          },
          { [lnb]: open },
        ),
      );
    };

  React.useEffect(() => {
    sendMessage('project', 'ListService', {});
  }, []);

  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute('webkitdirectory', '');
    }
  }, [ref]);

  const onFileChange = (e) => {
    const files = e.target.files;
    for (const file of files) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        EditorContentsStore.pushContentAction(
          file.webkitRelativePath,
          fileReader.result as string,
        );
      };
      fileReader.readAsText(file);
    }
  };

  const MyDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiPaper-root': {
      overflowX: 'hidden',
    },
  }));

  return (
    <div className="lnb">
      <MyDrawer
        variant="permanent"
        sx={{
          width: 50,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 65,
            boxSizing: 'border-box',
            background: '#F5F7F9',
            marginTop: 10,
          },
        }}
      >
        {(['explorer', 'search', 'scm', 'debug', 'extension'] as const).map(
          (lnb) => (
            <Button
              id={`lnb-${lnb}`}
              onClick={toggleDrawer(lnb, true)}
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
                onClose={toggleDrawer(lnb, false)}
                variant="persistent"
              >
                <Button onClick={toggleDrawer(lnb, false)}>
                  <CloseIcon className="lnb-close-icon" />
                </Button>
                {lnb === 'explorer' && <Explorer />}
                {lnb === 'search' && <div className="lnb-scm"></div>}
                {lnb === 'scm' && <SCM />}
                {lnb === 'debug' && (
                  <div className="lnb-scm">
                    <input
                      ref={ref}
                      type="file"
                      onChange={onFileChange}
                      multiple={true}
                      accept=".java"
                    />
                  </div>
                )}
                {lnb === 'extension' && <div className="lnb-scm"></div>}
              </Drawer>
            </>
          ),
        )}
      </MyDrawer>
    </div>
  );
};
