import * as React from "react";
import * as monaco from "monaco-editor";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import { setRequest } from "../../utils/service-utils";
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
  fileText?: string;
  setFileText?: Function;
  language: string;
  editorFilePath?: string;
  wsUrl?: string;
  selectedReference?: {
    name: string;
    refId: number;
    projId: number;
    type: number;
  };
  sourceCodeList?: any[];
}

const Editor: React.FC<IEditorProps> = (props: IEditorProps) => {
  const { fileText, editorFilePath, wsUrl, selectedReference, sourceCodeList } =
    props;
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
        value: fileText,
        // model,
      });
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
    console.log("tempToken");
    console.log(tempToken);
    setToken(tempToken);
  }, [text]);
  React.useEffect(() => {
    const model = monaco.editor.getEditors()[0].getModel();
    model.setValue(fileText);
  }, [fileText]);

  const [commitMessage, setCommitMessage] = React.useState(
    "Enter Commit Message"
  );
  const [result, setResult] = React.useState("");
  const onReferenceNameChange = (event) => {
    setCommitMessage(event.target.value);
  };
  const onCommitClick = () => {
    const commitSocket = new WebSocket(wsUrl);
    const modifiedSrc = [{ src_path: editorFilePath, content: text }];
    const nonModifiedSrc = [];
    sourceCodeList.map((s) => {
      if (s.srcPath != editorFilePath) {
        nonModifiedSrc.push({ src_path: s.srcPath, content: s.content });
      }
    });
    const request = setRequest("com.tmax.service.commit.InsertService", {
      proj_id: selectedReference.projId,
      ref_id: selectedReference.refId,
      commit: { message: commitMessage, is_commit: true },
      modified_src: modifiedSrc,
      non_modified_src: nonModifiedSrc,
    });
    commitSocket.onopen = (event) => {
      commitSocket.send(JSON.stringify(request));
    };

    commitSocket.onmessage = (event) => {
      console.log(event.data);
      const wsdata = JSON.parse(event.data).body.data;
      setResult(`${wsdata.message}(${wsdata.commitId}) is complite`);
    };
  };

  return (
    <div style={{ height: 750 }}>
      <div className="title">{editorFilePath}</div>
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
      {result}
      <div ref={assignRef} className="editor-container"></div>
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
