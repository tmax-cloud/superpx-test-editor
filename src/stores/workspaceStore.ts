import { observable } from "mobx";

type Reference = {
  name: string;
  refId: number;
  projId: number;
  type: number;
};

const WorkspaceStore = observable({
  // state
  wsUrl: "ws://172.22.11.2:38080",
  projectId: 0,
  reference: {
    name: "",
    refId: 0,
    projId: 0,
    type: 0,
  } as Reference,
  commitId: 0,
  sourceCodeList: [],

  // action
  updateProjectIdAction(projectId: number) {
    this.projectId = projectId;
  },

  updateReferenceAction(reference) {
    this.reference = reference;
  },

  updateCommitIdAction(commitId: number) {
    this.commitId = commitId;
  },

  updateSourceCodeListAction(sourceCodeList: []) {
    this.sourceCodeList = sourceCodeList;
  },

  pushContentAction(path: string, content: string) {
    this.contents.push({ path, content });
  },
});

export default WorkspaceStore;
