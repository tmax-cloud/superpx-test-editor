import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import EditorContentsStore from '../../stores/editorContentsStore';

const ProjectDetailPage: React.FC = () => {
  const { projectName } = useParams();

  return (
    <div className="center-area">
      {projectName} 프로젝트 상세페이지입니다.
      <Link to={`/projects/${projectName}/editor`}>
        <Button
          onClick={() => {
            EditorContentsStore.updateIsEditorView(true);
          }}
        >
          Open Editor
        </Button>
      </Link>
    </div>
  );
};

export default ProjectDetailPage;
