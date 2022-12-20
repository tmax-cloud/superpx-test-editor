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
