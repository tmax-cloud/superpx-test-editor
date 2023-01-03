import { observable } from "mobx";

const WorkspaceStore = observable({
  // state
  projectId: 0,
  refernceId: 0,
  commitId: 0,
  sourceCodeList: [
    {
      commitId: 0,
      content: "",
      createdTime: "",
      srcHistId: 0,
      srcId: 0,
      srcPath: "",
    },
  ],

  // action
  updateProjectIdAction(projectId: number) {
    this.projectId = projectId;
  },

  updateRefernceIdAction(refernceId: number) {
    this.refernceId = refernceId;
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
