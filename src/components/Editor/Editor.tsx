import * as React from 'react';
import * as monaco from 'monaco-editor';
import { Observer } from 'mobx-react';
import EditorContentsStore from '../../stores/editorContentsStore';
import { getExtensionOfFilename } from '../../utils/path-utils';
import WorkspaceStore from '../../stores/workspaceStore';

const Editor: React.FC = () => {
  let divNode;
  const assignRef = React.useCallback((node) => {
    // On mount get the ref of the div and assign it the divNode
    divNode = node;
  }, []);
  React.useEffect(() => {
    const path =
      EditorContentsStore.contents[EditorContentsStore.viewIndex].path;
    if (divNode) {
      const editor = monaco.editor.create(divNode, {
        language: getExtensionOfFilename(path),
        minimap: { enabled: true },
        autoIndent: 'full',
        theme: 'vs-dark',
        mouseWheelZoom: true,
        fontSize: 20,
        value:
          EditorContentsStore.contents[EditorContentsStore.viewIndex].content,
      });
      divNode.style.height = '100%';
      divNode.style.width = '100%';
      const model = editor.getModel();
      model.onDidChangeContent((e) => {
        EditorContentsStore.editContentAction(
          model.getValue(),
          EditorContentsStore.viewIndex,
        );
        WorkspaceStore.updateSourceCodeAction({
          srcPath: path,
          content: model.getValue(),
          edited: true,
        });
      });
    }
  });

  return (
    <Observer>
      {() => (
        <div className="editor-flex">
          <div ref={assignRef} className="center-container"></div>
        </div>
      )}
    </Observer>
  );
};

export { Editor };
