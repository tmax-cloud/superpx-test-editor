import * as React from 'react';
import { sendMessage } from '../../utils/service-utils';
import { Button } from '@mui/material';
import EditorContentsStore from '../../stores/editorContentsStore';
import { Commit } from '../../utils/types';
import WorkspaceStore from '../../stores/workspaceStore';

export const CommitLink: React.FC<CommitLinkProps> = ({ commit }) => {
  const onCommitinkClick = async () => {
    WorkspaceStore.updateCurrentCommitAction(commit);
    sendMessage('commit', 'DetailService', {
      commit_id: commit.commitId,
    });
    EditorContentsStore.initContentAction();
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
        {commit.message}
      </Button>
    </div>
  );
};

type CommitLinkProps = {
  commit: Commit;
};
