import * as React from 'react';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
import WorkspaceStore from '../../stores/workspaceStore';
import EditorContentsStore from '../../stores/editorContentsStore';
import { useObserver } from 'mobx-react';

export const SourceCodeTree: React.FC<SourceCodeTreeProps> = () => {
  const onSourceCodeLinkClick = ({ nodeData }) => {
    const { name, isOpen, srcPath} = nodeData;
    if (!isOpen) {
      EditorContentsStore.updateContentAction(name, srcPath);
    }
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
        let nameArray: Array<String> = node.children.map((child) => child.name);
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

type SourceCodeTreeProps = {
  nodeData?: {
    commitId: number;
    content: string;
    createdTime: string;
    srcHistId: number;
    srcId: number;
    srcPath: string;
  };
};