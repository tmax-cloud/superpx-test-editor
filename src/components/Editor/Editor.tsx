import * as React from 'react';
import * as monaco from 'monaco-editor';
import { observer, Observer } from 'mobx-react';
import EditorContentsStore from '../../stores/editorContentsStore';
import { getExtensionOfFilename } from '../../utils/path-utils';
import WorkspaceStore from '../../stores/workspaceStore';

const Editor: React.FC = () => {
  const editorRef = React.useRef(null);
  const divNodeRef = React.useRef(null);

  React.useEffect(() => {
    if (!divNodeRef.current || !EditorContentsStore.contents.length) {
      return;
    }

    const path =
      EditorContentsStore.contents[EditorContentsStore.viewIndex].path;

    const editor = monaco.editor.create(divNodeRef.current, {
      language: getExtensionOfFilename(path),
      minimap: { enabled: true },
      autoIndent: 'full',
      theme: 'vs-dark',
      mouseWheelZoom: true,
      fontSize: 15,
      value:
        EditorContentsStore.contents[EditorContentsStore.viewIndex].content,
    });

    editorRef.current = editor;

    divNodeRef.current.style.height = '100%';
    divNodeRef.current.style.width = '100%';

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

    return () => {
      editor.dispose();
    };
  }, [EditorContentsStore.contents]);

  return (
    <Observer>
      {() => (
        <div className="editor-flex">
          <div ref={divNodeRef} className="center-container"></div>
        </div>
      )}
    </Observer>
  );
};
export default observer(Editor);
