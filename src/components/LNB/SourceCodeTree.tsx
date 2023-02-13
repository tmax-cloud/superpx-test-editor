<<<<<<< HEAD
import * as React from "react";
import FolderTree from "react-folder-tree";
import "react-folder-tree/dist/style.css";
import WorkspaceStore from "../../stores/workspaceStore";
import EditorContentsStore from "../../stores/editorContentsStore";

export const SourceCodeTree = () => {
  const onSourceCodeLinkClick = ({ nodeData }) => {
    const { name, isOpen } = nodeData;
    const content = contentStore(name);
    if (!isOpen) {
      EditorContentsStore.updateContentAction(name, content);
    }
  };
  const contentStore = (name) => {
    let content='';
    WorkspaceStore.sourceCodeList.forEach((src)=>{
      const srcPathArray = src.srcPath.split("/");
      if(srcPathArray.includes(name))
      {
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
      const pathArray = src.srcPath.split("/");
      let nodeArray = pathArray.filter((nodePath, index) => {
        return index > 0;
      });
      nodeArray.forEach((nodePath, index, nodeArray) => {
        if (!node.children) {
=======
import * as React from 'react';
import { useObserver } from 'mobx-react';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
import WorkspaceStore from '../../stores/workspaceStore';
import testStore from '../../stores/fileTreeStore';
import EditorContentsStore from '../../stores/editorContentsStore';

export const SourceCodeTree = () => {
  function checkFileType(filePath) {
    let fileFormat = filePath.split('.');
    if (fileFormat.indexOf('xlsx') || fileFormat.indexOf('xls') > -1) {
      return true;
    } else {
      return false;
    }
  }

  const onSourceCodeLinkClick = ({ nodeData }) => {
    const { path, name, checked, isOpen, content } = nodeData;
    if (!(typeof nodeData.isOpen == 'boolean')) {
      EditorContentsStore.updateContentAction(nodeData.name, nodeData.content);
    }
  };

  const pathToJson = (sourceCodeList) => {
    const resultJson = {
      name: WorkspaceStore.reference.name,
      children: [],
      content: [],
    };
    console.log(sourceCodeList);
    sourceCodeList.forEach((srcList) => {
      let node = resultJson;
      const nodePaths = srcList.srcPath.split('/');
      const nodeData = srcList.content;
      const nodePath = nodePaths.shift();
      while (nodePaths.length > 0) {
        const nodePath = nodePaths.shift(); //while문 무한루프 가능성 상정
        if (typeof node.children == 'undefined') {
>>>>>>> e52fe1af3e45311498869a632688559f058e175b
          node.children = [];
        }
        let nameArray = node.children.map((src) => src.name);
        if (!nameArray.includes(nodePath)) {
          node.children.push({
            name: nodePath,
<<<<<<< HEAD
          });
        }
        node = node.children.filter(
          (pathList) => pathList.name === nodePath
        )[0];
      });
=======
            children: [],
          });
        } else {
          if (
            true
            // !node.children.map((srcList) => srcList.name).includes(nodePath)
            //  lint error나서 주석처리 및 true로 대체
          ) {
            if (nodePaths.length == 0) {
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
          (pathList) => pathList.name === nodePath,
        )[0];
      }
>>>>>>> e52fe1af3e45311498869a632688559f058e175b
    });
    return resultJson;
  };

<<<<<<< HEAD
  const Treedata = pathToJson(WorkspaceStore.sourceCodeList);

  return (
    <FolderTree
      data={Treedata}
      showCheckbox={false}
      indentPixels={5}
      onNameClick={onSourceCodeLinkClick}
    />
=======
  /*const onClickAdd = () => {
      testStore.addAction('src/component/BasicTree.tsx');
    };
  
    const onClickDelete = () => {
      testStore.deleteAction('src/component/BasicTree.tsx');
    };*/

  return (
    <div>
      <FolderTree
        data={pathToJson(WorkspaceStore.sourceCodeList)}
        showCheckbox={false}
        indentPixels={5}
        onNameClick={onSourceCodeLinkClick}
      />
    </div>
>>>>>>> e52fe1af3e45311498869a632688559f058e175b
  );
};
