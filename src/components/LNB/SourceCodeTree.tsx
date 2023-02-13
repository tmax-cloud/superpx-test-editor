import * as React from 'react';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
import WorkspaceStore from '../../stores/workspaceStore';
import EditorContentsStore from '../../stores/editorContentsStore';

export const SourceCodeTree = () => {
  const onSourceCodeLinkClick = ({ nodeData }) => {
    const { name, isOpen } = nodeData;
    const content = contentStore(name);
    if (!isOpen) {
      EditorContentsStore.updateContentAction(name, content);
    }
  };
  const contentStore = (name) => {
    let content = '';
    WorkspaceStore.sourceCodeList.forEach((src) => {
      const srcPathArray = src.srcPath.split('/');
      if (srcPathArray.includes(name)) {
        content = src.content;
      }
    });
    return content;
  };

  const pathToJson = (sourceCodeList) => {
    const resultJson = {
      name: WorkspaceStore.reference.name,
      children: [],
    };

    sourceCodeList.forEach((src) => {
      let node = resultJson;
      const pathArray = src.srcPath.split('/');
      let nodeArray = pathArray.filter((nodePath, index) => {
        return index > 0;
      });
      nodeArray.forEach((nodePath) => {
        if (!node.children) {
          node.children = [];
        }
        let nameArray = node.children.map((src) => src.name);
        if (!nameArray.includes(nodePath)) {
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

  return (
    <FolderTree
      data={Treedata}
      showCheckbox={false}
      indentPixels={5}
      onNameClick={onSourceCodeLinkClick}
    />
  );
};
