import * as React from "react";
import { setRequest } from "../../utils/service-utils";
import DeleteIcon from "@mui/icons-material/Delete";

export const RefernceLink: React.FC<ReferenceLinkProps> = ({
  wsUrl,
  referenceData,
  setSourceCodeList,
}) => {
  const onFileLinkClick = async () => {
    const exampleSocket = new WebSocket(wsUrl);
    const request = setRequest("com.tmax.service.reference.ListService", {
      proj_id: referenceData.projId,
    });
    exampleSocket.onopen = (event) => {
      exampleSocket.send(JSON.stringify(request));
    };

    exampleSocket.onmessage = (event) => {
      setSourceCodeList(JSON.parse(event.data).body.data);
    };
  };

  return (
    <div>
      <p onClick={onFileLinkClick}>{referenceData.name}</p>
      <DeleteIcon className="inline" />
    </div>
  );
};

type ReferenceLinkProps = {
  wsUrl: string;
  referenceData?: {
    refId: number;
    projId: number;
    name: string;
    type: number;
  };
  setSourceCodeList?: Function;
};
