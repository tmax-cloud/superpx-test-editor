import * as React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import * as _ from 'lodash';

export const getFolderStructure = (srcList) => {
  const structure = {};
  srcList.forEach((item) => {
    const path = item.srcPath.split('/');
    const createdTime = item.createdTime;
    let currentLevel = structure;
    for (let i = 1; i < path.length; i++) {
      const folder = path[i];
      if (!currentLevel[folder]) {
        currentLevel[folder] = i === path.length - 1 ? createdTime : {};
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
  const files = [];
  const folders = [];
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
          return (
            <ListItem key={newPathString}>
              <ListItemText
                primary={`📄 ${key}`}
                secondary={`Created: ${currentFolder[key]}`}
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
