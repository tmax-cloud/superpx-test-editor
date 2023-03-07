import * as React from 'react';
import { Editors } from './Editor/Editors';
import { EditorLNB } from './LNB/EditorLNB';
import { Observer } from 'mobx-react';
import EditorContentsStore from '../stores/editorContentsStore';
import { Outlet } from 'react-router-dom';

export default function Main() {
  return (
    <Observer>
      {() => (
        <>
          {EditorContentsStore.isEditorView ? <EditorLNB /> : <div></div>}
          <div
            className={
              EditorContentsStore.isFull ? 'center-area-full' : 'center-area'
            }
          >
            {EditorContentsStore.isEditorView ? <Editors /> : <div></div>}
            <Outlet />
          </div>
        </>
      )}
    </Observer>
  );
}
