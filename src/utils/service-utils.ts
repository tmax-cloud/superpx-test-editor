import WorkspaceStore from '../stores/workspaceStore';
import { servicePrefix } from '../utils/constants';
import EditorContentsStore from '../stores/editorContentsStore';

type ServiceCategory = 'project' | 'reference' | 'commit' | 'merge' | 'source';

const createRequest = (
  category: ServiceCategory,
  service: string,
  body: object,
) => {
  return {
    header: {
      targetServiceName: `${servicePrefix}.${category}.${service}`,
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
) => {
  WorkspaceStore.superPxWs.readyState === 0
    ? (WorkspaceStore.superPxWs.onopen = (event) => {
        WorkspaceStore.superPxWs.send(
          JSON.stringify(createRequest(category, service, body)),
        );
      })
    : WorkspaceStore.superPxWs.send(
        JSON.stringify(createRequest(category, service, body)),
      );
};

const projectInsertService = (data) => {
  WorkspaceStore.addProjectAction({ name: data.name, projId: data.projId });
};
const projectListService = (data) => {
  WorkspaceStore.updateProjectListAction(data);
};
const projectDetailService = (data) => {
};
const projectDeleteService = (data) => {
};

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
};
