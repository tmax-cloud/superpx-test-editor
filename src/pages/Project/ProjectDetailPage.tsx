import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';

const ProjectDetailPage: React.FC = () => {
  const { projectName } = useParams();

  return (
    <div className="editor-area">
      {projectName} 프로젝트 상세페이지입니다.
      <Link to={`/projects/${projectName}/editor`}>
        <Button>Open Editor</Button>
      </Link>
    </div>
  );
};

export default ProjectDetailPage;
