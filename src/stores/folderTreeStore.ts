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
    addFileAction(srcPath: string){
      const resultJson = this.folderTreeData;
      let node = resultJson;
      const nodeArray = srcPath.split('/');
      nodeArray.forEach((nodePath, index) => {
        if (!node.children) {
          node.children = [];
        }
        let nameArray: Array<String> = node.children.map((child) => child.name);
        if (!nameArray.includes(nodePath)) {
            node.children.push({
              name: nodePath,
              isFile: true,
              newfile: true,
              srcPath: srcPath,
            });
        }
        node = node.children.filter(
          (pathList) => pathList.name === nodePath,
        )[0];
      });
      this.folderTreeData = resultJson;
    },
  });
  
  export default FolderTreeStore;