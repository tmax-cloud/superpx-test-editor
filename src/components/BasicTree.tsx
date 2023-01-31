import React = require("react");
import { useObserver } from "mobx-react";
import FolderTree from "react-folder-tree";
import 'react-folder-tree/dist/style.css';
import indexStore from "../stores/indexStore";

export const BasicTree = () => {
    const { testData } = indexStore();
    const onTreeStateChange = (state, event) => console.log(state, event);
  
    return useObserver (()=>(
      <FolderTree
        data={ testData }
        onChange={ onTreeStateChange }
      />
      ));
  };