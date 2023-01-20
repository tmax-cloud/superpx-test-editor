import { Injectable } from "@angular/core";
import { LanguageService } from "../language-service";
import { Ast } from "../ast";
import { CharStreams, CommonTokenStream } from "antlr4ts";
import { Java9Lexer } from "../../ANTLR/Java9Lexer";
import { BlockContext, Java9Parser } from "../../ANTLR/Java9Parser";
import { TranscodeJava9Visitor } from "./TranscodeJava9Visitor";
import { Java9AstVisitor } from "./Java9AstVisitor";
import JavaErrorListener, { IJavaError } from "./JavaErrorListener";
import { parse } from "java-ast";

@Injectable({
  providedIn: "root",
})
export class JavaService extends LanguageService<BlockContext> {
  validate(code: string): IJavaError[] {
    const inputStream = CharStreams.fromString("{" + code + "}");
    const lexer = new Java9Lexer(inputStream);
    lexer.removeErrorListeners();
    const javaErrorListener = new JavaErrorListener();
    lexer.addErrorListener(javaErrorListener);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new Java9Parser(tokenStream);
    parser.removeErrorListeners();
    parser.addErrorListener(javaErrorListener);
    parser.block();
    const errors: IJavaError[] = javaErrorListener.getErrors();
    console.log(tokenStream);
    console.log(errors);

    // const syntaxErrors: IJavaError[] = [{startLineNumber: 1, startColumn: 2, endLineNumber: 1, endColumn: 5, message: 'testMessage', code: 'testCode'}];
    // const syntaxErrors = parseAndGetSyntaxErrors(code);
    //Later we will append semantic errors
    return errors;
  }
  convertCodeToAntlr(code: string): BlockContext {
    const ast = parse(code);
    console.log("ast");
    console.log(ast);

    const inputStream = CharStreams.fromString("{" + code + "}");
    const lexer = new Java9Lexer(inputStream);
    lexer.removeErrorListeners();
    const javaErrorListener = new JavaErrorListener();
    lexer.addErrorListener(javaErrorListener);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new Java9Parser(tokenStream);
    parser.removeErrorListeners();
    parser.addErrorListener(javaErrorListener);
    return parser.block();
  }

  convertAntlrToAst(antlrRoot: BlockContext): Ast {
    console.log("antlrRoot");
    console.log(antlrRoot);
    const visitor = new TranscodeJava9Visitor();
    const root = visitor.visitBlock(antlrRoot);
    return { root };
  }

  convertAstToCode(ast: Ast): string {
    super.convertAstToCode(ast);
    const visitor = new Java9AstVisitor();
    return visitor.visit(ast.root);
  }
}
