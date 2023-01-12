import * as monaco from "monaco-editor";
import { JavaService } from "./../language-service/java/JavaService";

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
const getAst = (model) => {
  const code = model.getValue();
  const javaService = new JavaService();
//   const antlr = javaService.convertCodeToAntlr(code);
//   const ast = javaService.convertAntlrToAst(antlr);
  const ast = javaService.convertCodeToAst(code);
  return ast;
};

const getClassData = (ast, word) => {
  if (word === "formatter") {
    return { name: "formatter", type: "DateTimeFormatter", isClass: true };
  }
  return { name: "", type: "", isClass: false };
};

const getDefinitionByApi = (model, position) => {
  const ast = getAst(model);
  const word = model.getWordAtPosition(position).word;
  const classData = getClassData(ast, word);
  //   let isClass = classData.isClass
  let isClass = model.getWordAtPosition(position).word === "formatter";

  if (isClass) {
    return getDefinition(model, position, classData);
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

const getDefinition = (model, position, classData) => {
  // api call

  return {
    defUri: model.uri,
    defRange: {
      startLineNumber: 9,
      startColumn: 9,
      endLineNumber: 9,
      endColumn: 26,
    },
  };
};
