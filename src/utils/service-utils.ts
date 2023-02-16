import WorkspaceStore from '../stores/workspaceStore';
import { setAlert } from './alert-utils';

const servicePrefix = 'super-px-0.1.4/com.tmax.scm.service';

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
  WorkspaceStore.superPxWs.onopen = function (event) {
    WorkspaceStore.superPxWs.send(
      JSON.stringify(createRequest(category, service, body)),
    );
  };
};

const projectInsertService = (data) => {
  setAlert(
    'Project Insert Service Call',
    `Project Insert Service Call`,
    'success',
  );
};
const projectListService = (data) => {
  setAlert('Project List Service Call', `Project List Service Call`, 'success');
};
const projectDetailService = (data) => {
  setAlert(
    'Project Detail Service Call',
    `Project Detail Service Call`,
    'success',
  );
};
const projectDeleteService = (data) => {
  setAlert(
    'Project Delete Service Call',
    `Project Delete Service Call`,
    'success',
  );
};

const referenceInsertService = (data) => {
  setAlert(
    'Reference Insert Service Call',
    `Reference Insert Service Call`,
    'success',
  );
};
const referenceListService = (data) => {
  setAlert(
    'Reference List Service Call',
    `Reference List Service Call`,
    'success',
  );
};
const referenceDetailService = (data) => {
  setAlert(
    'Reference Detail Service Call',
    `Reference Detail Service Call`,
    'success',
  );
};

const commitInsertService = (data) => {
  setAlert(
    'Commit Insert Service Call',
    `Commit Insert Service Call`,
    'success',
  );
};
const commitListService = (data) => {
  setAlert(
    'Reference List Service Call',
    `Reference List Service Call`,
    'success',
  );
};
const commitDetailService = (data) => {
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
