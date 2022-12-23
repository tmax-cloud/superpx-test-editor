import * as React from "react";
import { setRequest } from "../../utils/service-utils";

export const RefernceLink: React.FC<ReferenceLinkProps> = ({
  wsUrl,
  referencedata,
  setFileList,
}) => {
  const onFileLinkClick = async () => {
    const exampleSocket = new WebSocket(wsUrl);
    const request = setRequest("com.tmax.service.reference.ListService", {
      proj_id: referencedata.projId,
    });
    exampleSocket.onopen = (event) => {
      exampleSocket.send(JSON.stringify(request));
    };

    exampleSocket.onmessage = (event) => {
      setFileList(JSON.parse(event.data).body.data);
    };
  };

  return <p onClick={onFileLinkClick}>{referencedata.name}</p>;
};

type ReferenceLinkProps = {
  wsUrl: string;
  referencedata?: {
    refId: number;
    projId: number;
    name: string;
    type: number;
  };
  setFileList?: Function;
};
