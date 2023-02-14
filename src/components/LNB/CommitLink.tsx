import * as React from 'react';
import { setRequest } from '../../utils/service-utils';
import WorkspaceStore from '../../stores/workspaceStore';
import { Button } from '@mui/material';
import EditorContentsStore from '../../stores/editorContentsStore';

export const CommitLink: React.FC<CommitLinkProps> = ({
  wsUrl,
  commitData,
}) => {
  const onCommitinkClick = async () => {
    const commitSocket = new WebSocket(wsUrl);
    const commitSocketRequest = setRequest('commit', 'DetailService', {
      commit_id: commitData.commitId,
    });
    commitSocket.onopen = (event) => {
      commitSocket.send(JSON.stringify(commitSocketRequest));
      EditorContentsStore.initContentAction();
    };

    commitSocket.onmessage = (event) => {
      WorkspaceStore.updateSourceCodeListAction(JSON.parse(event.data).data);
    };
  };

  return (
    <div className="commit-link">
      <Button
        size="small"
        variant="text"
        color="inherit"
        className="commit-btn"
        onClick={onCommitinkClick}
      >
        {commitData.message}
      </Button>
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
};
