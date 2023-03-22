import * as React from 'react';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
function createTreeData(sourceCodeList) {
  const treeData = [];

  sourceCodeList.forEach((item) => {
    const pathParts = item.srcPath.split('/');
    let currentLevel = treeData;

    pathParts.forEach((part, index) => {
      const existingPath = currentLevel.find((level) => level.name === part);

      if (existingPath) {
        currentLevel = existingPath.children;
      } else {
        const newPart = {
          name: part,
          children: [],
          isFile: index === pathParts.length - 1,
          srcHistId: item.srcHistId,
          createdTime: item.createdTime,
          commitId: item.commitId,
          srcId: item.srcId,
        };

        currentLevel.push(newPart);

        if (!newPart.isFile) {
          currentLevel = newPart.children;
        }
      }
    });
  });

  return treeData;
}
function FileTreeView({ sourceCodeList }) {
  const [treeData, setTreeData] = React.useState([]);

  React.useEffect(() => {
    setTreeData(createTreeData(sourceCodeList));
  }, [sourceCodeList]);

  return (
    <div>
      <FolderTree
        data={treeData}
        headerTemplate={({ item }) => (
          <>
            {item.isFile ? (
              <i className="file-icon" />
            ) : (
              <i className="folder-icon" />
            )}
            <span>{item.name}</span>
          </>
        )}
        onItemClick={({ item }) => {
          console.log(1234, 'File clicked:', item);
        }}
      />
    </div>
  );
}

export default FileTreeView;
