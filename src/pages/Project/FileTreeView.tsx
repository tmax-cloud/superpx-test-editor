import * as React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import * as _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import { sendMessage } from '../../utils/service-utils';
import WorkspaceStore from '../../stores/workspaceStore';
import EditorContentsStore from '../../stores/editorContentsStore';
import { SourceCode } from '../../utils/types';

interface FileTreeViewProps {
  structure: {};
  currentPath: any[];
  onClick: (event: any) => void;
}

export const getFolderStructure = (srcList: SourceCode[]) => {
  const structure = {};
  srcList.forEach((item) => {
    const path = item.srcPath.split('/');
    const createdTime = item.createdTime;
    const srcId = item.srcId;
    let currentLevel = structure;
    for (let i = 1; i < path.length; i++) {
      const folder = path[i];
      if (!currentLevel[folder]) {
        currentLevel[folder] =
          i === path.length - 1 ? createdTime + '/' + srcId : {};
      }
      currentLevel = currentLevel[folder];
    }
  });
  return structure;
};

const FileTreeView = ({
  structure,
  currentPath,
  onClick,
}: FileTreeViewProps) => {
  const { projectName } = useParams();
  const pathString = currentPath.join('.');
  const currentFolder =
    currentPath.length === 0 ? structure : _.get(structure, pathString);
  const files = [];
  const folders = [];
  const navigate = useNavigate();
  if (!currentFolder) {
    return null;
  }

  Object.keys(currentFolder).forEach((key) => {
    if (typeof currentFolder[key] === 'string') {
      files.push(key);
    } else {
      folders.push(key);
    }
  });

  files.sort();
  folders.sort();
  const sortedKeys = [...folders, ...files];
  return (
    <List>
      {sortedKeys.map((key) => {
        const newPath = [...currentPath, key];
        const newPathString = newPath.join('.');

        if (typeof currentFolder[key] === 'string') {
          const lastCommitDate = currentFolder[key]?.split('/')[0];
          const lastCommitMessage = currentFolder[key]?.split('/')[0];
          const srcCodeId = Number(currentFolder[key]?.split('/')[1]);
          return (
            <ListItem
              key={newPathString}
              button
              onClick={() =>
                onClick((event) => {
                  EditorContentsStore.initContentAction();
                  navigate(`/projects/${projectName}/editor`);
                  sendMessage('source', 'DetailService', {
                    src_id: srcCodeId,
                    commit_id: WorkspaceStore.currentCommit.commitId,
                  });
                })
              }
              className="custom-list-item"
            >
              <ListItemText primary={`📄 ${key}`} className="left-align" />
              <ListItemText
                primary={`Created: ${lastCommitDate}`}
                className="center-align"
              />
              <ListItemText
                primary={`Created: ${lastCommitMessage}`}
                className="right-align"
              />
            </ListItem>
          );
        } else {
          return (
            <ListItem
              key={newPathString}
              button
              onClick={() => onClick(newPath)}
            >
              <ListItemText primary={`📁 ${key}`} />
            </ListItem>
          );
        }
      })}
    </List>
  );
};
export default FileTreeView;
