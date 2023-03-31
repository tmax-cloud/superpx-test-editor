import { observable } from 'mobx';
import { FolderTreeData } from '../utils/types';

const FolderTreeStore = observable({
    // state
    folderTreeData: {} as FolderTreeData,
    // action
    initTreeDataAction(referenceName) {
        this.folderTreeData.name = referenceName;
        this.folderTreeData.nodePath = '';
    },
    updateTreeDataAction(folderTreeData: FolderTreeData) {
      this.folderTreeData = folderTreeData;
    },
    changeToOpenAction(srcPath: string){
      const resultJson = this.folderTreeData;
      let node = resultJson;
      const nodeArray = srcPath.split('/');
      nodeArray.forEach((nodePath, index) => {
        if (index === nodeArray.length - 1)
            node.isOpen = true;
        node = node.children.filter(
          (pathList) => pathList.name === nodePath,
        )[0];
      });
      this.folderTreeData = resultJson;
      console.log(222,this.folderTreeData);
    },
    changeToCloseAction(srcPath: string){
      const resultJson = this.folderTreeData;
      let node = resultJson;
      const nodeArray = srcPath.split('/');
      nodeArray.forEach((nodePath, index) => {
        if (index === nodeArray.length - 1)
            node.isOpen = false;
        node = node.children.filter(
          (pathList) => pathList.name === nodePath,
        )[0];
      });
      this.folderTreeData = resultJson;
      console.log(222,this.folderTreeData);
    },
    updatePathToJsonAction(sourceCodeList){
      const resultJson = this.folderTreeData;
      sourceCodeList.forEach((src) => {
        let node = resultJson;
        const srcId = src.srcId;
        const nodeArray = src.srcPath.split('/');
        let nodeTotalPath: string = '';
        nodeArray.forEach((nodePath, index) => {
          if (!node.children) {
            node.children = [];
          }
          nodeTotalPath += nodePath;
          nodeTotalPath += '/';
          const nameArray: Array<String> = node.children.map(
            (child) => child.name,
          );
          if (!nameArray.includes(nodePath)) {
            if (index === nodeArray.length - 1)
              node.children.push({
                name: nodePath,
                srcId: srcId,
                isFile: true,
                newfile: src.newfile,
                srcPath: src.srcPath,
                content: src.content,
                edited: src.edited,
              });
            else if (index > 0) {
              node.children.push({
                name: nodePath,
                nodePath: nodeTotalPath,
                isOpen: false,
                isFile: false,
                children: [],
              });
            } else {
              node.children.push({
                name: nodePath,
                nodePath: nodeTotalPath,
                isOpen: true,
                isFile: false,
                children: [],
              });
            }
            node.children.sort((a, b) => a.name.localeCompare(b.name));
            node.children.sort((a, b) => a.isFile - b.isFile);
          }
          node = node.children.filter(
            (pathList) => pathList.name === nodePath,
          )[0];
        });
      });
      this.folderTreeData = resultJson;
    }
  });
  
  export default FolderTreeStore;