import * as React from "react";
import { setRequest, setService } from "../../utils/service-utils";
import { setAlert } from "../../utils/alert-utiles";
import WorkspaceStore from "../../stores/workspaceStore";
import { Button } from "@mui/material";

export const ReferenceLink: React.FC<ReferenceLinkProps> = ({
  wsUrl,
  referenceData,
  setCommitList,
}) => {
  const onRefereneLinkClick = async () => {
    WorkspaceStore.updateReferenceAction(referenceData);
    const referenceSocket = new WebSocket(wsUrl);
    const referenceRequest = setRequest(
      setService("reference", "DetailService"),
      {
        proj_id: referenceData.projId,
        ref_id: referenceData.refId,
      }
    );
    referenceSocket.onopen = (event) => {
      referenceSocket.send(JSON.stringify(referenceRequest));
    };

    referenceSocket.onmessage = (event) => {
      const wsdata = JSON.parse(event.data).data;
      setAlert(
        "Get Commit",
        `Get Commit List from Reference ${wsdata.name}.`,
        "success"
      );
      const commitSocket = new WebSocket(wsUrl);
      const commitSocketRequest = setRequest(
        setService("commit", "ListService"),
        {
          ref_id: referenceData.refId,
        }
      );
      commitSocket.onopen = (event) => {
        commitSocket.send(JSON.stringify(commitSocketRequest));
      };

      commitSocket.onmessage = (event) => {
        if (JSON.parse(event.data).data) {
          setCommitList(JSON.parse(event.data).data);
        }
        const commitId = JSON.parse(event.data).data
          ? JSON.parse(event.data).data[0].commitId
          : null;
        if (commitId) {
          const commitSocket = new WebSocket(wsUrl);
          const commitSocketRequest = setRequest(
            setService("commit", "DetailService"),
            {
              commit_id: commitId,
            }
          );
          commitSocket.onopen = (event) => {
            commitSocket.send(JSON.stringify(commitSocketRequest));
          };

          commitSocket.onmessage = (event) => {
            WorkspaceStore.updateSourceCodeListAction(
              JSON.parse(event.data).data
            );
          };
        } else {
          WorkspaceStore.updateSourceCodeListAction([]);
        }
      };
    };
  };

  return (
    <div className="commit-link">
      <Button
        size="small"
        variant="text"
        color="inherit"
        className="commit-btn"
        onClick={onRefereneLinkClick}
      >
        {referenceData.name}
      </Button>
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
};
