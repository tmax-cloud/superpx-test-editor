import React = require("react");
import { useObserver } from "mobx-react";
import FolderTree from "react-folder-tree";
import 'react-folder-tree/dist/style.css';
import indexStore from "../stores/indexStore";

export const BasicTree = () => {
    const { testStore } = indexStore();
    const onTreeStateChange = (state, event) => console.log(state, event);

    const pathToJson = (fileList)=>{
      let resultJson = {
        name: 'root',
        children: []
      };
      fileList.forEach((pathList) => {
        let node = resultJson;
        let nodePaths = pathList.path.split('/');
      while (nodePaths.length > 0) {
        let nodePath = nodePaths.shift();
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
      console.log(resultJson);
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
      
      {/*testStore.fileList.map((file)=>{
        return(
          <div>{file.path}</div>
        )
      })*/}
      <button onClick={onClickAdd}>Add</button>
      <button onClick={onClickDelete}>Delete</button>
      </div>
      ));
  };