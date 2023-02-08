import * as React from "react";
import * as monaco from "monaco-editor";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import { setRequest, setService } from "../../utils/service-utils";
import { useObserver } from "mobx-react";
import EditorContentsStore from "../../stores/editorContentsStore";
import WorkspaceStore from "../../stores/workspaceStore";
import { setAlert } from "../../utils/alert-utiles";
import { flexbox } from "@mui/system";
// import parseAndGetASTRoot from "../../language-service/parser";

// function validate(model) {
//   const markers = [];
//   // lines start at 1
//   for (let i = 1; i < model.getLineCount() + 1; i++) {
//     const range = {
//       startLineNumber: i,
//       startColumn: 1,
//       endLineNumber: i,
//       endColumn: model.getLineLength(i) + 1,
//     };
//     const content = model.getValueInRange(range).trim();
//     const number = Number(content);
//     if (Number.isNaN(number)) {
//       markers.push({
//         message: "not a number",
//         severity: monaco.MarkerSeverity.Error,
//         startLineNumber: range.startLineNumber,
//         startColumn: range.startColumn,
//         endLineNumber: range.endLineNumber,
//         endColumn: range.endColumn,
//       });
//     } else if (!Number.isInteger(number)) {
//       markers.push({
//         message: "not an integer",
//         severity: monaco.MarkerSeverity.Warning,
//         startLineNumber: range.startLineNumber,
//         startColumn: range.startColumn,
//         endLineNumber: range.endLineNumber,
//         endColumn: range.endColumn,
//       });
//     }
//   }
//   monaco.editor.setModelMarkers(model, "owner", markers);
// }

interface IEditorProps {
  language: string;
  contentsIndex?: number;
}

const Editor: React.FC<IEditorProps> = (props: IEditorProps) => {
  const [token, setToken] = React.useState([]);
  const [text, setText] = React.useState("");
  const [position, setPosition] = React.useState(new monaco.Position(0, 0));
  const [keyPosition, setKeyPosition] = React.useState(
    new monaco.Position(0, 0)
  );
  let divNode;
  const assignRef = React.useCallback((node) => {
    // On mount get the ref of the div and assign it the divNode
    divNode = node;
  }, []);
  React.useEffect(() => {
    if (divNode) {
      // const model = monaco.editor.createModel("", "java");
      const codeEditor = monaco.editor.create(divNode, {
        language: props.language,
        minimap: { enabled: true },
        autoIndent: "full",
        theme: "vs-dark",
        mouseWheelZoom: true,
        fontSize: 25,
        value:
          EditorContentsStore.contents[EditorContentsStore.veiwIndex].content,
        // model,
      });
      divNode.style.height = "100%";
      // validate(model);
      // model.onDidChangeContent(() => {
      //   // validate(model);
      // });
      const model = codeEditor.getModel();
      setText(model.getValue());
      model.onDidChangeContent((e) => {
        setText(model.getValue());
        setPosition(codeEditor.getPosition());
      });
      codeEditor.onKeyDown((e) => {
        setKeyPosition(codeEditor.getPosition());
      });
    }
    // const ast = parseAndGetASTRoot(`ADD TODO "Create an editor"\nCOMPLETE TODO "Create an editor"`);
    // console.log(ast);
  }, [assignRef]);
  React.useEffect(() => {
    const tempToken = monaco.editor.tokenize(text, "java");
    setToken(tempToken);
  }, [text]);
  React.useEffect(() => {
    const model = monaco.editor
      .getEditors()
      [EditorContentsStore.veiwIndex]?.getModel();
    model &&
      model.setValue(
        EditorContentsStore.contents[EditorContentsStore.veiwIndex]?.content
      );
  }, [EditorContentsStore.contents[EditorContentsStore.veiwIndex].content]);

  const [commitMessage, setCommitMessage] = React.useState(
    "Enter Commit Message"
  );
  const onReferenceNameChange = (event) => {
    setCommitMessage(event.target.value);
  };
  const onCommitClick = () => {
    const commitSocket = new WebSocket(WorkspaceStore.wsUrl);
    const modifiedSrc = [
      { src_path: EditorContentsStore.contents[0].path, content: text },
    ];
    const nonModifiedSrc = [];
    WorkspaceStore.sourceCodeList.map((s) => {
      if (s.srcPath != EditorContentsStore.contents[0].path) {
        nonModifiedSrc.push({ src_path: s.srcPath, content: s.content });
      }
    });
    const request = setRequest(setService("commit","InsertService"), {
      proj_id: WorkspaceStore.reference.projId,
      ref_id: WorkspaceStore.reference.refId,
      commit: { message: commitMessage, is_commit: true },
      modified_src: modifiedSrc,
      non_modified_src: nonModifiedSrc,
    });
    commitSocket.onopen = (event) => {
      commitSocket.send(JSON.stringify(request));
    };

    commitSocket.onmessage = (event) => {
      const wsdata = JSON.parse(event.data).data;
      setAlert(
        "Commit",
        `${wsdata.message}(${wsdata.commitId}) is done`,
        "success"
      );
    };
  };

  return (
    <div style={{ height: "80%", display: "flex", flexDirection: "column" }}>
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
      {/* <div>Content Change Position</div>
      <div>LineNumber : {position.lineNumber}</div>
      <div>Column : {position.column}</div>
      <div>Key Down Position</div>
      <div>LineNumber : {keyPosition.lineNumber}</div>
      <div>Column : {keyPosition.column}</div>
      <div>---</div>
      <div>Token</div>
      {token.map((lineToken) => {
        return (
          <div>
            {lineToken.map((t) => {
              return <span>{t.offset + " "}</span>;
            })}
          </div>
        );
      })} */}
    </div>
  );
};

export { Editor };
