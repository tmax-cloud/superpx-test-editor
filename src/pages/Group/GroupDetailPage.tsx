import * as React from 'react';
import { useParams } from 'react-router-dom';

const GroupDetailPage: React.FC = () => {
  const { groupName } = useParams();

  return (
    <div className="center-area">
      {groupName} 그룹 상세페이지입니다.
    </div>
  );
};

export default GroupDetailPage;
