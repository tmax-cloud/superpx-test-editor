import WorkspaceStore from '../stores/workspaceStore';
import { servicePrefix } from '../utils/constants';
import EditorContentsStore from '../stores/editorContentsStore';
import loadingStore from '../stores/loadingStore';
import { setAlert } from './alert-utils';

type ServiceCategory =
  | 'project'
  | 'reference'
  | 'commit'
  | 'merge'
  | 'source'
  | 'service';

const createRequest = (
  category: ServiceCategory,
  service: string,
  body: object,
  serviceKind?: string,
) => {
  return {
    header: {
      targetServiceName: `${
        serviceKind ? serviceKind : servicePrefix
      }.${category}.${service}`,
      messageType: 'REQUEST',
      contentType: 'TEXT',
    },
    body,
  };
};

export const sendMessage = (
  category: ServiceCategory,
  service: string,
  body: object,
  serviceKind?: string,
) => {
  WorkspaceStore.superPxWs.readyState === 0
    ? (WorkspaceStore.superPxWs.onopen = (event) => {
        WorkspaceStore.superPxWs.send(
          JSON.stringify(createRequest(category, service, body, serviceKind)),
        );
      })
    : WorkspaceStore.superPxWs.send(
        JSON.stringify(createRequest(category, service, body, serviceKind)),
      );
};

const projectInsertService = (data) => {
  WorkspaceStore.addProjectAction({ name: data.name, projId: data.projId });
  loadingStore.setLoading(false);
};
const projectGenerateService = (data) => {
  WorkspaceStore.addProjectAction({ name: data.name, projId: data.projId });
};
const projectListService = (data) => {
  WorkspaceStore.updateProjectListAction(data);
};
const projectDetailService = (data) => {};
const projectDeleteService = (data) => {};

const referenceInsertService = (data) => {
  WorkspaceStore.updateCurrentReferenceAction({
    name: data.name,
    projId: data.projId,
    refId: data.refId,
    type: data.type,
    newReference: true,
  });
  sendMessage('reference', 'ListService', {
    proj_name: WorkspaceStore.currentProject.name,
  });
};
const referenceListService = (data) => {
  WorkspaceStore.updateReferenceListAction(data);
  if (WorkspaceStore.currentReference.newReference) {
    WorkspaceStore.updateCurrentReferenceAction({
      ...WorkspaceStore.currentReference,
      newReference: false,
    });
  } else {
    const mainReference = data.filter((r) => r.name === 'main')[0] || data[0];
    WorkspaceStore.updateCurrentReferenceAction(mainReference);
  }
  sendMessage('commit', 'ListService', {
    proj_name: WorkspaceStore.currentProject.name,
    ref_name: WorkspaceStore.currentReference.name,
  });
};
const referenceDetailService = (data) => {
  sendMessage('commit', 'ListService', {
    proj_name: WorkspaceStore.currentProject.name,
    ref_name: data.name,
  });
};

const commitInsertService = (data) => {
  sendMessage('commit', 'ListService', {
    proj_name: WorkspaceStore.currentProject.name,
    ref_name: WorkspaceStore.currentReference.name,
  });
};
const commitListService = (data) => {
  if (data && data.length) {
    WorkspaceStore.updateCommitListAction(data);
    const lastCommit = data[data.length - 1];
    if (lastCommit) {
      WorkspaceStore.updateCurrentCommitAction(lastCommit);

      sendMessage('commit', 'DetailService', {
        commit_id: lastCommit.commitId,
      });
    }
  } else {
    WorkspaceStore.updateCommitListAction([]);
    WorkspaceStore.updateSourceCodeListAction([]);
  }
};
const commitDetailService = (data) => {
  WorkspaceStore.updateSourceCodeListAction(data);
};
const sourceDetailService = (data) => {
  EditorContentsStore.updateContentAction(data.srcPath, data.content);
};
const serviceCicdMW = (data) => {
  data.statusCode === 200
    ? setAlert(`success`, data.message, 'success')
    : setAlert(`error`, data.message, 'error');
};
const serviceCicdSA = (data) => {
  data.statusCode === 200
    ? setAlert(`success`, data.message, 'success')
    : setAlert(`error`, data.message, 'error');
};
const serviceGetHistoryDetail = (data) => {
  WorkspaceStore.updateCICDAction(data);
};
export const services = {
  ProjectInsertService: projectInsertService,
  ProjectListService: projectListService,
  ProjectDetailService: projectDetailService,
  ProjectDeleteService: projectDeleteService,
  ReferenceInsertService: referenceInsertService,
  ReferenceListService: referenceListService,
  ReferenceDetailService: referenceDetailService,
  CommitInsertService: commitInsertService,
  CommitListService: commitListService,
  CommitDetailService: commitDetailService,
  SourceDetailService: sourceDetailService,
  ProjectGenerateService: projectGenerateService,
  CicdMW: serviceCicdMW,
  CicdSA: serviceCicdSA,
  GetHistoryDetail: serviceGetHistoryDetail,
};
