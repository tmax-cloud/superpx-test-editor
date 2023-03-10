import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.css';
import './404.scss';
import { setupLanguage } from './java/setup';
import { GNB } from './components/GNB/GNB';
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom';
import { BaseAlert } from './components/Alert/Alert';
import EditorPage from './pages/Editor/EditorPage';
import { NotFound } from './components/ErrorPage/404';
import WorkspaceStore from './stores/workspaceStore';
import WelcomePage from './pages/Welcome'
import AboutPage from './pages/AboutPage';
import ProjectPage from './pages/Project/ProjectPage';
import ProjectDetailPage from './pages/Project/ProjectDetailPage';
import GroupPage from './pages/Group/GroupPage';
import GroupDetailPage from './pages/Group/GroupDetailPage';

WorkspaceStore.setupWsAction();
setupLanguage();

const App = () => {
  return (
    <>
      <BaseAlert />
      <GNB />
      <div className="content">
        <Outlet />
      </div>
    </>
  );
};

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '',
        element: <WelcomePage />,
      },
      {
        path: 'projects',
        element: <ProjectPage />,
      },
      {
        path: 'projects/:projectName',
        element: <ProjectDetailPage />,
      },
      {
        path: 'projects/:projectName/editor',
        element: <EditorPage />,
      },
      {
        path: 'groups',
        element: <GroupPage />,
      },
      {
        path: 'groups/:groupName',
        element: <GroupDetailPage />,
      },
      {
        path: 'editor',
        element: <EditorPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById('container'),
);
