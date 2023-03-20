import * as React from 'react';
import FolderTree from 'react-folder-tree';
import WorkspaceStore from '../../stores/workspaceStore';
import { Observer } from 'mobx-react';
import { sendMessage } from '../../utils/service-utils';
import 'react-folder-tree/dist/style.css';
import EditorContentsStore from '../../stores/editorContentsStore';

export const SourceCodeTree: React.FC = () => {
  const onSourceCodeLinkClick = ({ nodeData }) => {
    const { isFile, srcId, newfile, srcPath, content } = nodeData;
    if (isFile) {
      if (newfile) {
        EditorContentsStore.updateContentAction(srcPath, content)
        
      } else {
        sendMessage('source', 'DetailService', {
          src_id: srcId,
          commit_id: WorkspaceStore.currentCommit.commitId,
        });
      }
    }
  };

  const pathToJson = (sourceCodeList) => {
    const resultJson = {
      name: WorkspaceStore.currentReference.name,
      children: [],
    };

    sourceCodeList.forEach((src) => {
      let node = resultJson;
      const srcId = src.srcId;
      const nodeArray = src.srcPath.split('/');
      nodeArray.forEach((nodePath, index) => {
        if (!node.children) {
          node.children = [];
        }
        let nameArray: Array<String> = node.children.map((child) => child.name);
        if (!nameArray.includes(nodePath)) {
          if (index === nodeArray.length - 1)
            node.children.push({
              name: nodePath,
              srcId: srcId,
              isFile: true,
              newfile: src.newfile,
              srcPath: src.srcPath,
              content: src.content
            });
          else
            node.children.push({
              name: nodePath,
            });
        }
        node = node.children.filter(
          (pathList) => pathList.name === nodePath,
        )[0];
      });
    });
    return resultJson;
  };

  return (
    <Observer>
      {() => (
        <div className="source-code-tree">
          <FolderTree
            data={pathToJson(WorkspaceStore.sourceCodeList)}
            showCheckbox={false}
            indentPixels={5}
            onNameClick={onSourceCodeLinkClick}
          />
        </div>
      )}
    </Observer>
  );
};
