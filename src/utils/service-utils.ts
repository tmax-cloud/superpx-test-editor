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
