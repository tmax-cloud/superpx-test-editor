import * as React from "react";
import { setRequest } from "../../utils/service-utils";

export const CommitLink: React.FC<CommitLinkProps> = ({
  wsUrl,
  commitData,
  setSourceCodeList,
  setSelectedCommit,
}) => {
  const onCommitinkClick = async () => {
    setSelectedCommit(commitData);
    const commitSocket = new WebSocket(wsUrl);
    const commitSocketRequest = setRequest(
      "com.tmax.service.commit.DetailService",
      {
        commit_id: commitData.commitId,
      }
    );
    commitSocket.onopen = (event) => {
      commitSocket.send(JSON.stringify(commitSocketRequest));
    };

    commitSocket.onmessage = (event) => {
      setSourceCodeList(JSON.parse(event.data).body.data);
    };
  };

  return (
    <div>
      <span onClick={onCommitinkClick}>{commitData.message}</span>
    </div>
  );
};

type CommitLinkProps = {
  wsUrl: string;
  commitData?: {
    commitId: number;
    message: string;
    preCommitId: number;
    isCommit: boolean;
  };
  setSourceCodeList?: Function;
  setSelectedCommit?: Function;
};
