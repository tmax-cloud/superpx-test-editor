import React from 'react';
import { observer } from 'mobx-react-lite';

const LoadingScreen = observer(() => (
  <div className="loading-screen">
    <div className="spinner"></div>
    <p>데이터를 불러오는 중입니다...</p>
  </div>
));

export default LoadingScreen;
