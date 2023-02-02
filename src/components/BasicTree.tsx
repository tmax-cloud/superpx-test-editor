import * as React from "react";
import { useObserver } from "mobx-react";
import FolderTree from "react-folder-tree";
import 'react-folder-tree/dist/style.css';
import indexStore from "../stores/indexStore";

export const BasicTree = () => {
    const { testStore } = indexStore();
    const onTreeStateChange = (state, event) => console.log(state, event);

    const pathToJson = (fileList)=>{
      const resultJson = {
        name: 'project',
        children: []
      };
      fileList.forEach((pathList) => {
        let node = resultJson;
        const nodePaths = pathList.path.split('/');
      while (nodePaths.length > 0) {
        const nodePath = nodePaths.shift(); //while문 무한루프 가능성 상정
        if (!node.children.map(pathList => pathList.name).includes(nodePath)) {
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
        data={ pathToJson(testStore.fileList) }
        onChange={ onTreeStateChange }
      />
      
      <button onClick={onClickAdd}>Add</button>
      <button onClick={onClickDelete}>Delete</button>
      </div>
      ));
  };