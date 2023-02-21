import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.css';
import './404.scss';
import { setupLanguage } from './java/setup';
import { GNB } from './components/GNB/GNB';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BaseAlert } from './components/Alert/Alert';
import Main from './components/Main';
import { NotFound } from './components/ErrorPage/404';
import WorkspaceStore from './stores/workspaceStore';

WorkspaceStore.setupWsAction();
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

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('container'),
);
