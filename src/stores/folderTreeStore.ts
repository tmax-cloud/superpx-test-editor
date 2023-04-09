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
  changeToOpenAction(srcPath: string) {
    const resultJson = this.folderTreeData;
    let node = resultJson;
    const nodeArray = srcPath.split('/');
    nodeArray.forEach((nodePath, index) => {
      if (index === nodeArray.length - 1) node.isOpen = true;
      node = node.children.filter((pathList) => pathList.name === nodePath)[0];
    });
    this.folderTreeData = resultJson;
  },
  changeToCloseAction(srcPath: string) {
    const resultJson = this.folderTreeData;
    let node = resultJson;
    const nodeArray = srcPath.split('/');
    nodeArray.forEach((nodePath, index) => {
      if (index === nodeArray.length - 1) node.isOpen = false;
      node = node.children.filter((pathList) => pathList.name === nodePath)[0];
    });
    this.folderTreeData = resultJson;
  },
  updatePathToJsonAction(newFilePath) {
    const resultJson = this.folderTreeData;
    let node = resultJson;
    const nodeArray = newFilePath.split('/');
    nodeArray.forEach((nodePath, index) => {
      if (!node.children) {
        node.children = [];
      }
      const nameArray: Array<String> = node.children.map((child) => child.name);
      if (!nameArray.includes(nodePath)) {
        if (index === nodeArray.length - 1)
          node.children = [
            ...node.children,
            {
              name: nodePath,
              isFile: true,
              newfile: true,
              srcPath: newFilePath,
              content: '',
            },
          ];
        node.children.sort((a, b) => a.name.localeCompare(b.name));
        node.children.sort((a, b) => a.isFile - b.isFile);
      }
      node = node.children.filter((pathList) => pathList.name === nodePath)[0];
    });
    this.folderTreeData = { ...resultJson };
  },
  addNewFolderAction(newFolderPath) {
    const resultJson = this.folderTreeData;
    let node = resultJson;
    const nodeArray = newFolderPath.split('/');
    const nodeTotalPath = newFolderPath+'/';
    nodeArray.forEach((nodePath, index) => {
      if (!node.children) {
        node.children = [];
      }
      const nameArray: Array<String> = node.children.map((child) => child.name);
      if (!nameArray.includes(nodePath)) {
        if (index === nodeArray.length - 1)
          node.children = [
            ...node.children,
            {
              name: nodePath,
              isFile: false,
              isOpen: true,
              nodePath: nodeTotalPath,
              children: [],
            },
          ];
        node.children.sort((a, b) => a.name.localeCompare(b.name));
        node.children.sort((a, b) => a.isFile - b.isFile);
      }
      node = node.children.filter((pathList) => pathList.name === nodePath)[0];
    });
    this.folderTreeData = { ...resultJson };
  },
  renameNodeAction(lastSourcePath, newSourceName, newSourcePath, content) {
    const resultJson = this.folderTreeData;
    let node = resultJson;
    const nodeArray = lastSourcePath.split('/');
    nodeArray.forEach((nodePath, index) => {
        if (index === nodeArray.length - 1)
          node.children.forEach((n)=>{
            if(n.name === nodePath){
              n.name=newSourceName;
              n.srcPath=newSourcePath;
              n.edited=true;
              n.content=content;
            }
          })
        node.children.sort((a, b) => a.name.localeCompare(b.name));
        node.children.sort((a, b) => a.isFile - b.isFile);
      
      node = node.children.filter(
        (pathList) => pathList.name === nodePath,
      )[0];
    });
    this.folderTreeData = { ...resultJson };
  },
  renameFolderAction(pastFolderPath, newFolderPath, newFolderName) {
    const resultJson = this.folderTreeData;
    let node = resultJson;
    const nodeArray = pastFolderPath.split('/');
    nodeArray.forEach((nodePath, index) => {
      if (!node.children) {
        node.children = [];
      }
        if (index === nodeArray.length - 1)
          node.children.forEach((n)=>{
            if(n.name === nodePath){
              n.name=newFolderName;
              n.nodePath=newFolderPath;
            }
          })
        node.children.sort((a, b) => a.name.localeCompare(b.name));
        node.children.sort((a, b) => a.isFile - b.isFile);
      
      node = node.children.filter(
        (pathList) => pathList.name === nodePath,
      )[0];
    });
    this.folderTreeData = { ...resultJson };
  },
  deleteSourceCodeAction(pathValue) {
    const resultJson = this.folderTreeData;
    let node = resultJson;
    const nodeArray = pathValue.split('/');
    nodeArray.forEach((nodePath, index) => {
      if (!node.children) {
        node.children = [];
      }
      if (index === nodeArray.length - 1) {
        node.children = node.children.filter((c) => c.name !== nodePath);
      }
      node.children.sort((a, b) => a.name.localeCompare(b.name));
      node.children.sort((a, b) => a.isFile - b.isFile);
      node = node.children.filter((pathList) => pathList.name === nodePath)[0];
    });
    this.folderTreeData = { ...resultJson };
  },
  updateContentAction(SourcePath, content) {
    const resultJson = this.folderTreeData;
    let node = resultJson;
    const nodeArray = SourcePath.split('/');
    nodeArray.forEach((nodePath, index) => {
      if (!node.children) {
        node.children = [];
      }
        if (index === nodeArray.length - 1)
          node.children.forEach((n)=>{
            if(n.name === nodePath){
              n.edited=true;
              n.content=content;
            }
          })
        node.children.sort((a, b) => a.name.localeCompare(b.name));
        node.children.sort((a, b) => a.isFile - b.isFile);
      
      node = node.children.filter(
        (pathList) => pathList.name === nodePath,
      )[0];
    });
    this.folderTreeData = { ...resultJson };
  },
});

export default FolderTreeStore;
