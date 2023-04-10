export type Project = {
  projId?: number;
  name: string;
};

export type Reference = {
  name: string;
  refId: number;
  projId: number;
  type: number;
  newReference?: boolean;
};

export type Commit = {
  commitId?: number;
  message?: string;
  preCommitId?: number;
  isCommit?: boolean;
  createdTime?: string;
};

export type SourceCode = {
  srcHistId?: number;
  createdTime?: string;
  commitId?: number;
  srcPath: string;
  srcId?: number;
  content?: string;
  newfile?: boolean;
  edited?: boolean;
  deleted?: boolean;
};

export type FolderTreeData = {
  name: string;
  nodePath?: string;
  srcPath?: string;
  srcId?: number;
  content?: string;
  newfile?: boolean;
  edited?: boolean;
  children?: Array<FolderTreeData>;
  _id?: number;
  isOpen?: boolean;
  isFile?: boolean;
};
