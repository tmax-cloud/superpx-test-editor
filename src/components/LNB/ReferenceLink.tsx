import * as React from "react";
import { setRequest } from "../../utils/service-utils";
import { setAlert } from "../../utils/alert-utiles";
import WorkspaceStore from "../../stores/workspaceStore";

export const RefernceLink: React.FC<ReferenceLinkProps> = ({
  wsUrl,
  referenceData,
  setCommitList,
  setSelectedCommit,
}) => {
  const onRefereneLinkClick = async () => {
    WorkspaceStore.updateRefernceAction(referenceData);
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
      setAlert("Get Reference", `Get Reference ${wsdata.name}.`, "success");
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
        if (JSON.parse(event.data).body.data) {
          setCommitList(JSON.parse(event.data).body.data);
          setSelectedCommit(JSON.parse(event.data).body.data[0]);
        }
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
            WorkspaceStore.updateSourceCodeListAction(
              JSON.parse(event.data).body.data
            );
          };
        } else {
          WorkspaceStore.updateSourceCodeListAction([]);
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
  setCommitList?: Function;
  setSelectedCommit?: Function;
};
