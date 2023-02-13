import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.css';
import { setupLanguage } from './java/setup';
import { GNB } from './components/GNB/GNB';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BaseAlert } from './components/Alert/Alert';
import Main from './components/Main';

export const defaultWsUrl = 'ws://172.22.11.2:38080';
setupLanguage();
const App = () => {
  return (
    <>
      <BaseAlert />
      <GNB />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
    </>
  );
};

const NotFound = () => {
  return <div>404 Error</div>;
};

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('container'),
);
