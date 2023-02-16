import WorkspaceStore from '../stores/workspaceStore';
import { setAlert } from './alert-utils';
import { wsUrl, servicePrefix } from '../utils/constants';

type ServiceCategory = 'project' | 'reference' | 'commit' | 'merge';

export const setRequest = (
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
  setAlert(
    'Project Insert Service Call',
    `Add Project to ${wsUrl}.`,
    'success',
  );
};
const projectListService = (data) => {
  WorkspaceStore.updateProjectListAction(data);
  setAlert(
    'Project List Service Call',
    `Get Project List from ${wsUrl}.`,
    'success',
  );
};
const projectDetailService = (data) => {
  setAlert(
    'Project Detail Service Call',
    `Get Reference List from Project ${data.name}.`,
    'success',
  );
};
const projectDeleteService = (data) => {
  setAlert('Project Delete Service Call', `Delete Project.`, 'success');
};

const referenceInsertService = (data) => {
  WorkspaceStore.updateCurrentReferenceAction({
    name: data.name,
    projId: data.projId,
    refId: data.refId,
    type: data.type,
  });
  setAlert(
    'Reference Insert Service Call',
    `Add Reference(${data.name}) to ${WorkspaceStore.currentProject.name}(${WorkspaceStore.currentProject.projId}).`,
    'success',
  );
};
const referenceListService = (data) => {
  WorkspaceStore.updateReferenceListAction(data);
  const mainReference = data.filter((r) => r.name === 'main')[0] || data[0];
  WorkspaceStore.updateCurrentReferenceAction(mainReference);
  sendMessage('commit', 'ListService', {
    proj_name: WorkspaceStore.currentProject.name,
    ref_name: mainReference.name,
  });
  setAlert(
    'Reference List Service Call',
    `Reference List Service Call`,
    'success',
  );
};
const referenceDetailService = (data) => {
  setAlert(
    'Reference Detail Service Call',
    `Get Commit List from Reference ${data.name}.`,
    'success',
  );
  sendMessage('commit', 'ListService', {
    ref_id: data.refId,
  });
};

const commitInsertService = (data) => {
  setAlert(
    'Commit Insert Service Call',
    `Commit Insert Service Call`,
    'success',
  );
};
const commitListService = (data) => {
  if (data) {
    WorkspaceStore.updateCommitListAction(data);
    if (data[0]) {
      WorkspaceStore.updateCurrentCommitAction(data[0]);

      sendMessage('commit', 'DetailService', {
        commit_id: data[0].commitId,
      });
    }
  } else {
    WorkspaceStore.updateCommitListAction([]);
    WorkspaceStore.updateSourceCodeListAction([]);
  }

  setAlert(
    'Reference List Service Call',
    `Reference List Service Call`,
    'success',
  );
};
const commitDetailService = (data) => {
  WorkspaceStore.updateSourceCodeListAction(data);
  setAlert(
    'Commit Detail Service Call',
    `Commit Detail Service Call`,
    'success',
  );
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
};
