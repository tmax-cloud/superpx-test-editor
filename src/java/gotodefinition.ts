import * as monaco from "monaco-editor";

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
const getAst = () => {
  const ast = {};
  return ast;
};

const getClassData = (ast, word) => {
  if (word === "formatter") {
    return { name: "formatter", type: "DateTimeFormatter", isClass: true };
  }
  return { name: "", type: "", isClass: false };
};

const getDefinitionByApi = (model, position) => {
  const ast = getAst();
  const word = model.getWordAtPosition(position).word;
  const classData = getClassData(ast, word);
  //   let isClass = classData.isClass
  let isClass = model.getWordAtPosition(position).word === "formatter";

  if (isClass) {
    return getDefinition(model, position, classData);
  }

//   const result = {
//     defUri: model.uri,
//     defRange: {
//       startLineNumber: 3,
//       startColumn: 9,
//       endLineNumber: 3,
//       endColumn: 20,
//     },
//   };
//   return result;
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
      }
}