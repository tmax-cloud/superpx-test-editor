import * as React from 'react';
import { sendMessage } from '../../utils/service-utils';
import WorkspaceStore from '../../stores/workspaceStore';
import { Button } from '@mui/material';
import { Reference } from '../../utils/types';

export const ReferenceLink: React.FC<ReferenceLinkProps> = ({ reference }) => {
  const onRefereneLinkClick = async () => {
    WorkspaceStore.updateCurrentReferenceAction(reference);
    sendMessage('reference', 'DetailService', {
      proj_name: WorkspaceStore.currentProject.name,
      ref_name: reference.name,
    });
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
        {reference.name}
      </Button>
    </div>
  );
};

type ReferenceLinkProps = {
  reference: Reference;
};
