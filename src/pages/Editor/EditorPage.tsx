import * as React from 'react';
import { Editors } from '../../components/Editor/Editors';
import { EditorLNB } from '../../components/LNB/EditorLNB';
import { Observer } from 'mobx-react';
import EditorContentsStore from '../../stores/editorContentsStore';
import { useParams } from 'react-router-dom';
import { sendMessage } from '../../utils/service-utils';
import WorkspaceStore from '../../stores/workspaceStore';
import { EditorGNB } from '../../components/GNB/EditorGNB';
import { EditorStatusBar } from '../../components/Editor/EditorStatusBar';

export default function EditorPage() {
  const { projectName } = useParams();
  React.useEffect(() => {
    if (projectName) {
      WorkspaceStore.updateCurrentProjectAction({ name: projectName });
      sendMessage('reference', 'ListService', {
        proj_name: projectName,
      });
      EditorContentsStore.updateShowProjectSelect(false);
    } else {
      EditorContentsStore.updateShowProjectSelect(true);
    }
  });
  return (
    <div>
      <EditorGNB />
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
