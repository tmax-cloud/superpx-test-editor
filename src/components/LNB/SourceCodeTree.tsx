import * as React from "react";
import FolderTree from "react-folder-tree";
import "react-folder-tree/dist/style.css";
import WorkspaceStore from "../../stores/workspaceStore";
import EditorContentsStore from "../../stores/editorContentsStore";

export const SourceCodeTree = () => {
  const onSourceCodeLinkClick = ({ nodeData }) => {
    const { name, isOpen, content } = nodeData;
    if (!isOpen) {
      EditorContentsStore.updateContentAction(name, content);
    }
  };

  const pathToJson = (sourceCodeList) => {
    const resultJson = {
      name: WorkspaceStore.reference.name,
      children: [],
      content: [],
    };

    sourceCodeList.forEach((src) => {
      let node = resultJson;
      const nodeArray = src.srcPath.split("/");
      const nodeData = src.content;
      nodeArray.shift();
      while (nodeArray.length > 0) {
        const nodePath = nodeArray.shift();
        if (!node.children) {
          node.children = [];
          node.children.push({
            name: nodePath,
            children: [],
          });
        } else {
          if (
            !node.children.map((src) => src.name).includes(nodePath)
          ) {
            if (nodeArray.length === 0) {
              node.children.push({
                name: nodePath,
                content: nodeData,
              });
            } else {
              node.children.push({
                name: nodePath,
                children: [],
              });
            }
          }
        }
        node = node.children.filter(
          (pathList) => pathList.name === nodePath
        )[0];
      }
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
