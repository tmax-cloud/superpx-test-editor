import * as React from 'react';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
import WorkspaceStore from '../../stores/workspaceStore';
import EditorContentsStore from '../../stores/editorContentsStore';
import { useObserver } from 'mobx-react';

export const SourceCodeTree = () => {
  const onSourceCodeLinkClick = ({ nodeData }) => {
    const { name, isOpen, srcPath } = nodeData;
    const code = getContent(srcPath);
    if (!isOpen) {
      EditorContentsStore.updateContentAction(name, code);
    }
  };
  const getContent = (path) => {
    let content = '';
    WorkspaceStore.sourceCodeList.forEach((src) => {
      if (path === src.srcPath) {
        content = src.content;
      }
    });
    return content;
  };

  const pathToJson = (sourceCodeList) => {
    const resultJson = {
      name: WorkspaceStore.currentReference.name,
      children: [],
    };

    sourceCodeList.forEach((src) => {
      let node = resultJson;
      const nodeArray = src.srcPath.split('/');
      const pathString = src.srcPath;
      nodeArray.forEach((nodePath, index) => {
        if (!node.children) {
          node.children = [];
        }
        let nameArray = node.children.map((child) => child.name);
        if (!nameArray.includes(nodePath)) {
          if (index === nodeArray.length - 1)
            node.children.push({
              name: nodePath,
              srcPath: pathString,
            });
          else
            node.children.push({
              name: nodePath,
            });
        }
        node = node.children.filter(
          (pathList) => pathList.name === nodePath,
        )[0];
      });
    });
    return resultJson;
  };

  const Treedata = pathToJson(WorkspaceStore.sourceCodeList);

  return useObserver(() => (
    <FolderTree
      data={Treedata}
      showCheckbox={false}
      indentPixels={5}
      onNameClick={onSourceCodeLinkClick}
    />
  ));
};
