import * as _ from 'lodash';
import { observable } from 'mobx';
import { setAlert } from '../utils/alert-utils';
import { services } from '../utils/service-utils';
import { wsUrl } from '../utils/constants';
import { Project, Reference, Commit, SourceCode, CICD } from '../utils/types';
import loadingStore from './loadingStore';

const WorkspaceStore = observable({
  // state
  superPxWs: {} as WebSocket,
  projectList: [] as Project[],
  currentProject: {} as Project,
  referenceList: [] as Reference[],
  currentReference: {} as Reference,
  commitList: [] as Commit[],
  currentCommit: {} as Commit,
  sourceCodeList: [] as SourceCode[],
  CICDList: [] as CICD[],
  currentCICD: {} as CICD,

  // action
  setupWsAction() {
    this.superPxWs = new WebSocket(wsUrl);
    this.superPxWs.onopen = (event) => {
      setAlert('Open WebSocket', `Open WebSocket ${wsUrl}`, 'success');
    };
    this.superPxWs.onmessage = (event) => {
      const { data, path, message } = JSON.parse(event.data).body;
      const service = services[path];
      if (path === 'CicdSA' || path === 'CicdMW') {
        service(JSON.parse(event.data).body);
        loadingStore.setLoading(false);
        return;
      }
      path === 'ProjectGenerateService' && loadingStore.setLoading(false);
      if (service) {
        if (data) {
          service(data);
        } else {
          setAlert(`No ${path} Data.`, message, 'error');
          path === 'CommitListService' &&
            this.updateCommitListAction([]) &&
            this.sourceCodeList([]);
        }
      } else {
        setAlert(message, `No Service ${path}.`, 'error');
      }
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
    this.currentProject = { ...project };
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
    this.currentCommit = commit;
  },
  updateSourceCodeListAction(sourceCodeList: SourceCode[]) {
    this.sourceCodeList = sourceCodeList;
  },
  addSourceCodeAction(sourceCode: SourceCode) {
    this.sourceCodeList.push(sourceCode);
  },
  addNewSourceCodeAction(sourceCode: SourceCode) {
    this.sourceCodeList.push(sourceCode);
  },
  renameSourceCodeAction(lastSourcePath, newSourcePath, content) {
    this.sourceCodeList.push({
      srcPath: newSourcePath,
      newfile: true,
      content: content,
    });
    this.sourceCodeList = this.sourceCodeList.map((s) => {
      if (s.srcPath === lastSourcePath) {
        s.deleted = true;
      }
      return s;
    });
  },
  updateSourceCodeAction(sourceCode: SourceCode) {
    this.sourceCodeList.filter((s) => s.srcPath === sourceCode.srcPath)[0] =
      _.merge(
        this.sourceCodeList.filter((s) => s.srcPath === sourceCode.srcPath)[0],
        sourceCode,
      );
  },
  pushSourceCodeListAction() {
    return this.sourceCodeList;
  },
  deleteSourceCodeAction(srcPath: string) {
    this.sourceCodeList = this.sourceCodeList.map((s) => {
      if (s.srcPath === srcPath) {
        s.deleted = true;
      }
      return s;
    });
  },
  deleteDirectoryAction(nodePath: string) {
    this.sourceCodeList = this.sourceCodeList.map((s) => {
      if (s.srcPath.includes(nodePath, 0)) {
        s.deleted = true;
      }
      return s;
    });
  },
  getContentAction(srcPath: string) {
    const content = this.sourceCodeList.map((s) => {
      if (s.srcPath === srcPath) {
        return s.content;
      }
    })[0];
    return content;
  },
  updateCICDListAction(CICDList: CICD[]) {
    this.CICDList = [...CICDList];
  },
  updateCICDAction(CICD: CICD) {
    this.currentCICD = { ...CICD };
  },
});

export default WorkspaceStore;
