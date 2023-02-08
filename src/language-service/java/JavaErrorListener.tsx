import { ANTLRErrorListener, CommonTokenStream, RecognitionException, Recognizer } from "antlr4ts";

export interface IJavaError {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  message: string;
  code: string;
}

export default class JavaErrorListener implements ANTLRErrorListener<any> {
  private errors: IJavaError[] = [];
  syntaxError(
    recognizer: Recognizer<any, any>,
    offendingSymbol: any,
    line: number,
    charPositionInLine: number,
    message: string,
    e: RecognitionException | undefined
  ): void {
    const errorToken = (recognizer as any)?.inputStream?.tokens[offendingSymbol.index-1];
    this.errors.push({
      startLineNumber: errorToken._line,
      endLineNumber: errorToken._line,
      startColumn: errorToken.charPositionInLine,
      endColumn: errorToken.charPositionInLine + 1,
      message,
      code: '123', // This the error code you can customize them as you want
    });
  }

  getErrors(): IJavaError[] {
    return this.errors;
  }
}
