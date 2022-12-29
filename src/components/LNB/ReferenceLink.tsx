import * as React from "react";
import { setRequest } from "../../utils/service-utils";
import DeleteIcon from "@mui/icons-material/Delete";

export const RefernceLink: React.FC<ReferenceLinkProps> = ({
  wsUrl,
  referenceData,
  setSourceCodeList,
  setSelectedReference,
}) => {
  const onRefereneLinkClick = async () => {
    setSelectedReference(referenceData);
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
      const commitSocket = new WebSocket(wsUrl);
      const commitSocketRequest = setRequest(
        "com.tmax.service.commit.ListService",
        {
          ref_id: referenceData.refId,
        }
      );
      commitSocket.onopen = (event) => {
        commitSocket.send(JSON.stringify(commitSocketRequest));
      };

      commitSocket.onmessage = (event) => {
        const commitId = JSON.parse(event.data).body.data
          ? JSON.parse(event.data).body.data[0].commitId
          : null;
        if (commitId) {
          const commitSocket = new WebSocket(wsUrl);
          const commitSocketRequest = setRequest(
            "com.tmax.service.commit.DetailService",
            {
              commit_id: commitId,
            }
          );
          commitSocket.onopen = (event) => {
            commitSocket.send(JSON.stringify(commitSocketRequest));
          };

          commitSocket.onmessage = (event) => {
            setSourceCodeList(JSON.parse(event.data).body.data);
          };
        } else {
          setSourceCodeList([]);
        }
      };
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
  setSelectedReference?: Function;
};
