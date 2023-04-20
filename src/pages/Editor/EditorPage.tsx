import * as React from 'react';
import { Editors } from '../../components/Editor/Editors';
import { EditorLNB } from '../../components/LNB/EditorLNB';
import { Observer, observer } from 'mobx-react';
import EditorContentsStore from '../../stores/editorContentsStore';
import { useParams } from 'react-router-dom';
import { sendMessage } from '../../utils/service-utils';
import WorkspaceStore from '../../stores/workspaceStore';
import FolderTreeStore from '../../stores/folderTreeStore';
import { EditorStatusBar } from '../../components/Editor/EditorStatusBar';

function EditorPage() {
  const { projectName } = useParams();
  React.useEffect(() => {
    FolderTreeStore.initNeedUpdateAction(true);
    if (projectName && WorkspaceStore.projectList.length) {
      WorkspaceStore.updateCurrentProjectAction({ name: projectName });
      sendMessage('reference', 'ListService', {
        proj_name: projectName,
      });
      EditorContentsStore.updateShowProjectSelect(false);
    } else {
      EditorContentsStore.updateShowProjectSelect(true);
    }
  }, [WorkspaceStore.projectList, projectName]);
  React.useEffect(() => {
    sendMessage('project', 'ListService', {});
  }, []);
  return (
    <div>
      <Observer>
        {() => (
          <>
            <EditorLNB />
            <div
              className={
                EditorContentsStore.isFull ? 'center-area-full' : 'center-area'
              }
            >
              <Editors />
            </div>
          </>
        )}
      </Observer>
      <EditorStatusBar />
    </div>
  );
}
export default observer(EditorPage);
