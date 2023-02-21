import * as React from 'react';
import * as monaco from 'monaco-editor';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { sendMessage } from '../../utils/service-utils';
import { useObserver } from 'mobx-react';
import EditorContentsStore from '../../stores/editorContentsStore';
import WorkspaceStore from '../../stores/workspaceStore';

interface IEditorProps {
  language: string;
  contentsIndex?: number;
}

const Editor: React.FC<IEditorProps> = (props: IEditorProps) => {
  let divNode;
  const assignRef = React.useCallback((node) => {
    // On mount get the ref of the div and assign it the divNode
    divNode = node;
  }, []);
  React.useEffect(() => {
    if (divNode) {
      monaco.editor.create(divNode, {
        language: props.language,
        minimap: { enabled: true },
        autoIndent: 'full',
        theme: 'vs-dark',
        mouseWheelZoom: true,
        fontSize: 20,
        value:
          EditorContentsStore.contents[EditorContentsStore.veiwIndex].content,
      });
      divNode.style.height = '100%';
      divNode.style.width = '100%';
    }
  }, [assignRef]);
  React.useEffect(() => {
    const model = monaco.editor
      .getEditors()
      [EditorContentsStore.veiwIndex]?.getModel();
    model &&
      model.setValue(
        EditorContentsStore.contents[EditorContentsStore.veiwIndex]?.content,
      );
  }, [EditorContentsStore.contents[EditorContentsStore.veiwIndex].content]);

  const [commitMessage, setCommitMessage] = React.useState(
    'Enter Commit Message',
  );
  const onReferenceNameChange = (event) => {
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
    <div className="editor-flex">
      {useObserver(() => (
        <>
          <div ref={assignRef} className="editor-container"></div>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Commit Message"
            type="text"
            fullWidth
            variant="standard"
            onChange={onReferenceNameChange}
          />
          <Button variant="outlined" onClick={onCommitClick}>
            Commit
            <AddIcon />
          </Button>
        </>
      ))}
    </div>
  );
};

export { Editor };
