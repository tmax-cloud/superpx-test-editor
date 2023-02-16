import { observable } from 'mobx';
import { setAlert } from '../utils/alert-utils';
import { services } from '../utils/service-utils';

type Project = {
  projId: number;
  name: string;
};

type Reference = {
  name: string;
  refId: number;
  projId: number;
  type: number;
};

const defaultWsUrl = 'ws://172.22.11.2:38080';

const WorkspaceStore = observable({
  // state
  wsUrl: defaultWsUrl,
  superPxWs: {} as WebSocket,
  projectList: [] as Project[],
  projectId: 0,
  reference: {
    name: '',
    refId: 0,
    projId: 0,
    type: 0,
  } as Reference,
  commitId: 0,
  sourceCodeList: [],

  // action
  setupWsAction() {
    this.superPxWs = new WebSocket(this.wsUrl);
    this.superPxWs.onopen = (event) => {
      setAlert('Open WebSocket', `Open WebSocket ${this.wsUrl}`, 'success');
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
