import * as React from "react";
import { useObserver } from "mobx-react";
import FolderTree from "react-folder-tree";
import 'react-folder-tree/dist/style.css';
import WorkspaceStore from "../stores/workspaceStore";
import testStore from "../stores/fileTreeStore";

export const BasicTree = () => {

    const pathToJson = (sourceCodeList)=>{
      const resultJson = {
        name: (WorkspaceStore.reference.name),
        children: []
      };
      console.log(sourceCodeList);
      sourceCodeList.forEach((srcList) => {
        console.log(srcList);
        let node = resultJson;
        const nodePaths = srcList.srcPath.split('/');
      while (nodePaths.length > 0) {
        const nodePath = nodePaths.shift(); //while문 무한루프 가능성 상정
        if (!node.children.map(srcList => srcList.name).includes(nodePath)) {
          if(nodePath.includes('.')){
            node.children.push({
              name: nodePath
            }  
            );
          }
          else{
            node.children.push({
              name: nodePath,
              children: []
            }  
            );
          };
        }
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

    return useObserver (()=>(
      <div>
      <FolderTree
        data={ pathToJson(WorkspaceStore.sourceCodeList) }
        showCheckbox={ false }
        
      />
      
      <button onClick={onClickAdd}>Add</button>
      <button onClick={onClickDelete}>Delete</button>
      </div>
      ));
    };
