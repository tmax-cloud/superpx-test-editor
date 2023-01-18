import { observable } from "mobx";

const WorkspaceStore = observable({
  // state
  wsUrl: "ws://172.22.11.2:38080",
  projectId: 0,
  refernce: {
    name: "",
    refId: 0,
    projId: 0,
    type: 0,
  },
  commitId: 0,
  sourceCodeList: [],

  // action
  updateProjectIdAction(projectId: number) {
    this.projectId = projectId;
  },

  updateRefernceAction(refernce) {
    this.refernce = refernce;
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
