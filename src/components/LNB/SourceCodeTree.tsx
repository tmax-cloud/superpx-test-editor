import * as React from "react";
import { useObserver } from "mobx-react";
import FolderTree from "react-folder-tree";
import 'react-folder-tree/dist/style.css';
import WorkspaceStore from "../../stores/workspaceStore";
import testStore from "../../stores/fileTreeStore";
import EditorContentsStore from "../../stores/editorContentsStore";

export const SourceCodeTree = () => {
      const onSourceCodeLinkClick = ({defaultOnClick, nodeData}) => {
        const {path, name, checked, isOpen, content} = nodeData
        if(nodeData.name.includes('.')){
        EditorContentsStore.updateContentAction(
          nodeData.path,
          nodeData.content
        )
        }
      };

    const pathToJson = (sourceCodeList)=>{
      const resultJson = {
        name: (WorkspaceStore.reference.name),
        children: [],
        content: []
      };
      console.log(sourceCodeList);
      sourceCodeList.forEach((srcList) => {
        let node = resultJson;
        const nodePaths = srcList.srcPath.split('/');
        const nodeData = srcList.content;
        const nodePath = nodePaths.shift();
      while (nodePaths.length > 0) {
        const nodePath = nodePaths.shift(); //while문 무한루프 가능성 상정
        console.log(typeof node.children);
        if (typeof node.children == "undefined"){
          node.children = [];
        if(nodePath.includes('.')){
          node.children.push({
            name: nodePath,
            content: nodeData,
          }  
          );
        }
        else{
          node.children.push({
            name: nodePath,
            children: [],
          }  
          );
        }}
        else {
        if (!node.children.map(srcList => srcList.name).includes(nodePath)) {
          if(nodePath.includes('.')){
            node.children.push({
              name: nodePath,
              content: nodeData,
            }  
            );
          }
          else{
            node.children.push({
              name: nodePath,
              children: [],
            }  
            );
          };
        }};
        node = node.children.filter(pathList => pathList.name === nodePath)[0];
      }
      });
      return resultJson;
    };

    const onClickAdd = () => {
      testStore.addAction('src/component/BasicTree.tsx');
    };
  
    const onClickDelete = () => {
      testStore.deleteAction('src/component/BasicTree.tsx');
    };

    return (
      <div>
      <FolderTree
        data={ pathToJson(WorkspaceStore.sourceCodeList) }
        showCheckbox={ false }
        indentPixels={ 5 }
        onNameClick={onSourceCodeLinkClick}
      />
      
      </div>
      );
    };
