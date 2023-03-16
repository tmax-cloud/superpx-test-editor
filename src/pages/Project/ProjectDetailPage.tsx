import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { ProjectLNB } from '../../components/LNB/ProjectLNB';

const ProjectDetailPage: React.FC = () => {
  const { projectName } = useParams();

  return (
    <div>
      <ProjectLNB />
      <div className="center-area">
        {projectName} 프로젝트 상세페이지입니다.
        <Link to={`/projects/${projectName}/editor`}>
          <Button>Open Editor</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
