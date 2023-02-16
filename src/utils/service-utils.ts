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

export const sendMessage = (
  category: ServiceCategory,
  service: string,
  body: object,
) => {
  WorkspaceStore.superPxWs.onopen = function (event) {
    WorkspaceStore.superPxWs.send(
      JSON.stringify(setRequest(category, service, body)),
    );
  };
};

const projectListService = () => {
  setAlert('Project List Service Call', `Project List Service Call`, 'success');
};
const projectDetailService = () => {
  setAlert(
    'Project Detail Service Call',
    `Project Detail Service Call`,
    'success',
  );
};

export const services = {
  ProjectListService: projectListService,
  ProjectDetailService: projectDetailService,
};
