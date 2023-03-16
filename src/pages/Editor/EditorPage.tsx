import * as React from 'react';
import { Editors } from '../../components/Editor/Editors';
import { EditorLNB } from '../../components/LNB/EditorLNB';
import { Observer } from 'mobx-react';
import EditorContentsStore from '../../stores/editorContentsStore';
import { useParams } from 'react-router-dom';
import { sendMessage } from '../../utils/service-utils';
import WorkspaceStore from '../../stores/workspaceStore';

export default function EditorPage() {
  const { projectName } = useParams();
  React.useEffect(() => {
    WorkspaceStore.updateCurrentProjectAction({ name: projectName });
    sendMessage('reference', 'ListService', {
      proj_name: projectName,
    });
    EditorContentsStore.updateIsEditorView(true);
    if (projectName) {
      EditorContentsStore.updateEditorLnbInitState('explorer');
      EditorContentsStore.updateShowProjectSelect(false);
    }
  });
  return (
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
  );
}
