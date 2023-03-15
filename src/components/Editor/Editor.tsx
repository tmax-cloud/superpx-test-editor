import * as React from 'react';
import * as monaco from 'monaco-editor';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { sendMessage } from '../../utils/service-utils';
import { Observer } from 'mobx-react';
import EditorContentsStore from '../../stores/editorContentsStore';
import WorkspaceStore from '../../stores/workspaceStore';

interface IEditorProps {
  language: string;
}

const Editor: React.FC<IEditorProps> = (props: IEditorProps) => {
  let divNode;
  const assignRef = React.useCallback((node) => {
    // On mount get the ref of the div and assign it the divNode
    divNode = node;
  }, []);
  React.useEffect(() => {
    if (divNode) {
      const editor = monaco.editor.create(divNode, {
        language: props.language,
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
      });
    }
  });

  const [commitMessage, setCommitMessage] = React.useState(
    'Enter Commit Message',
  );
  const onCommitMessageChange = (event) => {
    setCommitMessage(event.target.value);
  };
  const onCommitClick = () => {
    const modifiedSrc = [...EditorContentsStore.contents].map((item) => {
      return {
        ...item,
        src_path: item.path,
      };
    });

    const nonModifiedSrc = WorkspaceStore.sourceCodeList.filter(
      (s) => !modifiedSrc.find((c) => c.src_path === s.srcPath),
    );

    sendMessage('commit', 'InsertService', {
      proj_id: WorkspaceStore.currentReference.projId,
      ref_id: WorkspaceStore.currentReference.refId,
      commit: { message: commitMessage, is_commit: true },
      modified_src: modifiedSrc,
      non_modified_src: nonModifiedSrc,
    });
  };

  return (
    <Observer>
      {() => (
        <div className="editor-flex">
          <div ref={assignRef} className="center-container"></div>

          <TextField
            margin="dense"
            id="name"
            label="Commit Message"
            type="text"
            fullWidth
            variant="standard"
            onChange={onCommitMessageChange}
          />
          <Button variant="outlined" onClick={onCommitClick}>
            Commit
            <AddIcon />
          </Button>
        </div>
      )}
    </Observer>
  );
};

export { Editor };
