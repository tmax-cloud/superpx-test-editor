import { observable } from 'mobx';
import { setAlert } from '../utils/alert-utils';
import { services } from '../utils/service-utils';
import { wsUrl } from '../utils/constants';
import { Project, Reference, Commit, SourceCode } from '../utils/types';

const WorkspaceStore = observable({
  // state
  superPxWs: {} as WebSocket,
  projectList: [] as Project[],
  currentProject: {} as Project,
  projectId: 0,
  referenceList: [] as Reference[],
  currentReference: {} as Reference,
  commitList: [] as Commit[],
  currentCommit: {} as Commit,
  commitId: 0,
  sourceCodeList: [] as SourceCode[],

  // action
  setupWsAction() {
    this.superPxWs = new WebSocket(wsUrl);
    this.superPxWs.onopen = (event) => {
      setAlert('Open WebSocket', `Open WebSocket ${wsUrl}`, 'success');
    };
    this.superPxWs.onmessage = (event) => {
      const { data, path, message } = JSON.parse(event.data).body;
      const service = services[path];
      service
        ? service(data)
        : setAlert(message, `No Service ${path}.`, 'error');
    };
  },
  resetWsUrlAction() {
    this.superPxWs.close();
    this.setupWsAction();
  },

  updateProjectListAction(projectList: Project[]) {
    this.projectList = projectList;
  },
  addProjectAction(project: Project) {
    this.projectList.push(project);
  },
  deleteProjectAction(projId: number) {
    this.projectList = this.projectList.filter(
      (p: Project) => p.projId !== projId,
    );
  },

  updateCurrentProjectAction(project: Project) {
    this.currentProject = project;
  },
  updateProjectIdAction(projectId: number) {
    this.projectId = projectId;
  },

  updateReferenceListAction(referenceList: Reference[]) {
    this.referenceList = referenceList;
  },
  updateCurrentReferenceAction(reference: Reference) {
    this.currentReference = reference;
  },

  updateCommitListAction(commitList: Commit[]) {
    this.commitList = commitList;
  },
  updateCurrentCommitAction(commit: Commit) {
    this.currentcommit = commit;
  },
  updateCommitIdAction(commitId: number) {
    this.commitId = commitId;
  },

  updateSourceCodeListAction(sourceCodeList: SourceCode[]) {
    this.sourceCodeList = sourceCodeList;
  },
});

export default WorkspaceStore;
