import * as React from 'react';
import WorkspaceStore from '../../../stores/workspaceStore';
import { SourceCodeTree } from '../SourceCodeTree';
import { Observer } from 'mobx-react';

export const Explorer: React.FC = () => {
  return (
    <div className="editor-lnb-drawer">
      <Observer>
        {() =>
          WorkspaceStore.sourceCodeList &&
          WorkspaceStore.sourceCodeList.length > 0 && <SourceCodeTree />
        }
      </Observer>
    </div>
  );
};
