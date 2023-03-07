import * as React from 'react';
import { Editors } from '../../components/Editor/Editors';
import { EditorLNB } from '../../components/LNB/EditorLNB';
import { Observer } from 'mobx-react';
import EditorContentsStore from '../../stores/editorContentsStore';

export default function EditorPage() {
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
