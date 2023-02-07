const servicePrefix = "super-px-0.1.4/com.tmax.scm.service";

type ServiceCategory = "project" | "reference" | "commit" | "merge";

export const setService = (category: ServiceCategory, service: string) => {
  return `${servicePrefix}.${category}.${service}`;
};

export const setRequest = (targetServiceName: string, body: object) => {
  return {
    header: {
      targetServiceName,
      messageType: "REQUEST",
      contentType: "TEXT",
    },
    body: body,
  };
};
