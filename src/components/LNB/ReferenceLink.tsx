import * as React from "react";
import { setRequest } from "../../utils/service-utils";
import DeleteIcon from "@mui/icons-material/Delete";

export const RefernceLink: React.FC<ReferenceLinkProps> = ({
  wsUrl,
  referenceData,
  setSourceCodeList,
}) => {
  const onRefereneLinkClick = async () => {
    const refernceSocket = new WebSocket(wsUrl);
    const refernceRequest = setRequest(
      "com.tmax.service.reference.DetailService",
      {
        proj_id: referenceData.projId,
        ref_id: referenceData.refId,
      }
    );
    refernceSocket.onopen = (event) => {
      refernceSocket.send(JSON.stringify(refernceRequest));
    };

    refernceSocket.onmessage = (event) => {
      const wsdata = JSON.parse(event.data).body.data;
      alert(`Get Reference ${wsdata.name}.`);
    };
  };

  return (
    <div>
      <span onClick={onRefereneLinkClick}>{referenceData.name}</span>
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
