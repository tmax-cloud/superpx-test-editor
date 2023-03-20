export type Project = {
  projId?: number;
  name: string;
};

export type Reference = {
  name: string;
  refId: number;
  projId: number;
  type: number;
};

export type Commit = {
  commitId: number;
  message: string;
  preCommitId: number;
  isCommit: boolean;
};

export type SourceCode = {
  srcHistId?: number;
  createdTime?: string;
  commitId?: number;
  srcPath: string;
  srcId?: number;
  content?: string;
  newfile?: boolean;
};
