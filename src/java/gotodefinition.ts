import * as monaco from "monaco-editor";
import { JavaService } from "./../language-service/java/JavaService";
import { setAlert } from "../utils/alert-utiles";
import { TerminalNode } from "antlr4ts/tree";
import {
  TypeIdentifierContext,
  VariableDeclaratorIdContext,
  ClassOrInterfaceModifierContext,
  IdentifierContext,
  MethodCallContext,
  TypeTypeOrVoidContext,
} from "../ANTLR/java/JavaParser";

export const setGoToDefinitionProvdier = () => {
  monaco.languages.registerDefinitionProvider("java", {
    provideDefinition: (model, position, token) => {
      const { defUri, defRange } = getDefinitionByApi(model, position);
      return {
        uri: defUri,
        range: defRange,
      };
    },
  });
};
const getCompilationUnit = (model) => {
  const code = model.getValue();
  const javaService = new JavaService();
  return javaService.convertCodeToCompilationUnit(code);
};

const getNodeData = (compilationUnit, position, word) => {
  let nodeType = "";
  const getNodeType = (node) => {
    if (
      node.text === word &&
      !(node instanceof TerminalNode) &&
      node._start._line &&
      node._start._line === position.lineNumber &&
      node._start._charPositionInLine <= position.column &&
      node._start._charPositionInLine + node._start.stop - node._start.start >=
        position.column
    ) {
      console.log(node);
      if (node instanceof VariableDeclaratorIdContext) {
        nodeType = "VariableDeclaratorIdContext";
      } else if (node instanceof TypeIdentifierContext) {
        nodeType = "TypeIdentifierContext";
      } else if (node instanceof ClassOrInterfaceModifierContext) {
        nodeType = "ClassOrInterfaceModifierContext";
      } else if (node instanceof IdentifierContext) {
        nodeType = "IdentifierContext";
        if (node._parent instanceof MethodCallContext) {
          nodeType = "IdentifierContext and Parent is MethodCallContext";
        }
      } else if (node instanceof TypeTypeOrVoidContext) {
        nodeType = "TypeTypeOrVoidContext";
      }
    }
    node.children?.map((child) => getNodeType(child));
  };
  getNodeType(compilationUnit);
  return nodeType ? { word, type: nodeType } : null;
};

const getDefinitionByApi = (model, position) => {
  const compilationUnit = getCompilationUnit(model);
  const word = model.getWordAtPosition(position).word;
  const nodeData = getNodeData(compilationUnit, position, word);

  if (nodeData) {
    return getDefinition(model, position, nodeData);
  }
  return {
    defUri: model.uri,
    defRange: {
      startLineNumber: position.startLineNumber,
      startColumn: position.startColumn,
      endLineNumber: position.endLineNumber,
      endColumn: position.endColumn,
    },
  };
};

const getDefinition = (model, position, nodeData) => {
  // api call
  setAlert(
    nodeData.type,
    `${nodeData.word}'s node type is ${nodeData.type}`,
    "info"
  );

  return {
    defUri: model.uri,
    defRange: {
      startLineNumber: position.startLineNumber,
      startColumn: position.startColumn,
      endLineNumber: position.endLineNumber,
      endColumn: position.endColumn,
    },
  };
};
