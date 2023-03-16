import * as React from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SearchIcon from '@mui/icons-material/Search';
import CommitIcon from '@mui/icons-material/Commit';
import BugReportIcon from '@mui/icons-material/BugReport';
import ExtensionIcon from '@mui/icons-material/Extension';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

type Lnb =
  | 'project'
  | 'repository'
  | 'issues'
  | 'mergeRequests'
  | 'cicd'
  | 'wiki'
  | 'snippets'
  | 'members';

export const ProjectLNB: React.FC = () => {
  const lnbIcon = {
    project: <LibraryBooksIcon />,
    repository: <SearchIcon />,
    issues: <SearchIcon />,
    mergeRequests: <CommitIcon />,
    cicd: <BugReportIcon />,
    wiki: <ExtensionIcon />,
    snippets: <ExtensionIcon />,
    members: <ExtensionIcon />,
  };
  const Lnbs: Lnb[] = [
    'project',
    'repository',
    'issues',
    'mergeRequests',
    'cicd',
    'wiki',
    'snippets',
    'members',
  ];
  const { projectName } = useParams();
  return (
    <div className="project-lnb">
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ p: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {projectName.charAt(0)}
          </Avatar>
        </Box>
        <Box sx={{ p: 2 }}>
          <div>
            <b>{projectName}</b>
          </div>
          <div>{projectName}</div>
        </Box>
      </Box>
      {Lnbs.map((lnb) => (
        <div id={`lnb-${lnb}`}>
          <Button>
            {lnbIcon[lnb]}
            <span>{lnb}</span>
          </Button>
        </div>
      ))}
    </div>
  );
};
