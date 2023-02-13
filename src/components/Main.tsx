import * as React from 'react';
import { Editors } from './Editor/Editors';
import { LNB } from './LNB/LNB';
import { useObserver } from 'mobx-react';
import EditorContentsStore from '../stores/editorContentsStore';

export default function Main() {
  return useObserver(() => (
    <>
      <LNB />
      <div
        className={
          EditorContentsStore.isFull ? 'editor-area-full' : 'editor-area'
        }
      >
        <Editors />
      </div>
    </>
  ));
}
