import * as React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import * as _ from 'lodash';

export const getFolderStructure = (srcList) => {
  const structure = {};

  srcList.forEach((item) => {
    const path = item.srcPath.split('/');

    let currentLevel = structure;
    for (let i = 0; i < path.length; i++) {
      const folder = path[i];
      if (!currentLevel[folder]) {
        currentLevel[folder] = i === path.length - 1 ? 'file' : {};
      }
      currentLevel = currentLevel[folder];
    }
  });
  return structure;
};

const FileTreeView = ({ structure, currentPath, onClick }) => {
  const pathString = currentPath.join('.');
  const currentFolder =
    currentPath.length === 0 ? structure : _.get(structure, pathString);

  if (!currentFolder) {
    return null;
  }

  return (
    <List>
      {Object.keys(currentFolder).map((key) => {
        const newPath = [...currentPath, key];
        const newPathString = newPath.join('.');

        if (currentFolder[key] === 'file') {
          return (
            <ListItem key={newPathString}>
              <ListItemText primary={`📄 ${key}`} />
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
