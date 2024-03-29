# README
WIP

```bash
npm install # 모듈 다운로드
npm run start # 실행
# 콘솔창에서 loadmap관련 warning뜬다면
# 개발자도구 - source - setting - enable JS loadmap 해제
```

### 간략 구조 설명

```.
├── src
│   ├── ANTLR # JavaRule 관련 auto-gen
│   │   ├── Java9Lexer.ts
│   │   ├── Java9Parser.ts
│   │   └── ...
│   ├── java #
│   │   ├── DiagnosticsAdapter.ts # worker동작 editor 표출
│   │   ├── WorkerManager.ts # worker 관리
│   │   ├── java.ts # java 정의 (syntax/highligting)
│   │   ├── java.worker.ts # web-worker
│   │   ├── javaWorker.ts # worker 정의: language-service 메소드 호출
│   │   └── setup.ts # editor세팅- worker등록 호출
│   ├── language-service
│   │   ├── java
│   │   │   ├── Java9AstVisitor.ts
│   │   │   ├── JavaService.ts # language-service: code2ANTLR,ANTLR2AST,etc
```

### Features

- syntax highlighting
- syntax validation
- get text from websocket

## syntax highlighting
- ANTLR 통해 생성된 룰을 바탕으로 java highlighting, validation 수행함

## get text from websocket
- srcId 입력 받고 Web Socket 연결해서 com.tmax.service.sourceCode.DetailSrcService 를 통해서 소스코드 데이터를 받고 monaco editor 로 보냄


### TODO ?

- ASTgen
- CodeGen
- auto-suggest
- editor error notifcation


동작확인용) [확인용 유튜브 링크](https://youtu.be/ot9c24vEWoI)




---
## references:
-  [ANTLR grammar rules](https://github.com/antlr/grammars-v4)
- [GIT: monaco editor supporting custom-language with ANTLR](https://github.com/nimbleways/blogpost-todo-lang-editor.git) - [blog](https://betterprogramming.pub/create-a-custom-web-editor-using-typescript-react-antlr-and-monaco-editor-bcfc7554e446)
- [GIT: ANTLR for JAVA](https://github.com/nrubin29/transcode)
- [GIT: MONACO EDITOR](https://github.com/microsoft/monaco-editor)
