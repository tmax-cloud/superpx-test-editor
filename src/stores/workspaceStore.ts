import { observable } from 'mobx';
import { setAlert } from '../utils/alert-utils';
import { services } from '../utils/service-utils';
import { wsUrl } from '../utils/constants';
import { Project, Reference, Commit, SourceCode } from '../utils/types';

const WorkspaceStore = observable({
  // state
  superPxWs: {} as WebSocket,
  projectList: [] as Project[],
  projectId: 0,
  referenceList: [] as Reference[],
  reference: {} as Reference,
  commitList: [] as Commit[],
  commitId: 0,
  sourceCodeList: [] as SourceCode[],

  // action
  setupWsAction() {
    this.superPxWs = new WebSocket(wsUrl);
    this.superPxWs.onopen = (event) => {
      setAlert('Open WebSocket', `Open WebSocket ${wsUrl}`, 'success');
    };
    this.superPxWs.onmessage = (event) => {
      const { data, path, message } = JSON.parse(event.data);
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
  addProjectAction(project) {
    this.projectList.push(project);
  },
  deleteProjectAction(projId: number) {
    this.projectList = this.projectList.filter(
      (p: Project) => p.projId !== projId,
    );
  },

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
});

export default WorkspaceStore;
