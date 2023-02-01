import React = require("react");
import { useObserver } from "mobx-react";
import FolderTree from "react-folder-tree";
import 'react-folder-tree/dist/style.css';
import indexStore from "../stores/indexStore";

export const BasicTree = () => {
    const { testStore } = indexStore();
    const onTreeStateChange = (state, event) => console.log(state, event);

    const pathToJson = (fileList)=>{
      let resultJson = {};
      
      return resultJson;
    };

    const onClickAdd = () => {
      testStore.addAction('src/component/Alert.tsx');
    };
  
    const onClickDelete = () => {
      testStore.deleteAction('src/component/Alert.tsx');
    };

    return useObserver (()=>(
      <div>
      <FolderTree
        data={ pathToJson(testStore.fileList) }
        onChange={ onTreeStateChange }
      />
      {testStore.fileList.map((file)=>{
        return(
          <div>{file.path}</div>
        )
      })}
      <button onClick={onClickAdd}>Add</button>
      <button onClick={onClickDelete}>Delete</button>
      </div>
      ));
  };