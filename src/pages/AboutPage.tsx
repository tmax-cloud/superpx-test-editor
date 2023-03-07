import * as React from 'react';
import { Observer } from 'mobx-react';
import EditorContentsStore from '../stores/editorContentsStore';
const AboutPage: React.FC = () => {
  return (
    <Observer>
      {() => (
        <div
          className={
            EditorContentsStore.isFull ? 'center-area-full' : 'center-area'
          }
        >
          <h1>About</h1>
          <p>super px</p>
        </div>
      )}
    </Observer>
  );
};

export default AboutPage;
