import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.css';
import './404.scss';
import { setupLanguage } from './java/setup';
import { GNB } from './components/GNB/GNB';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { BaseAlert } from './components/Alert/Alert';
import EditorPage from './pages/Editor/EditorPage';
import { NotFound } from './components/ErrorPage/404';
import WorkspaceStore from './stores/workspaceStore';
import AboutPage from './pages/AboutPage';
import ProjectPage from './pages/Project/ProjectPage';
import ProjectDetailPage from './pages/Project/ProjectDetailPage';
import CommitHistory from './pages/Project/CommitHistory';
import GroupPage from './pages/Group/GroupPage';
import GroupDetailPage from './pages/Group/GroupDetailPage';
import './utils/i18n/i18n';
import Create from './pages/Project/Create';
import CreateBlank from './pages/Project/CreateBlank';
import CreateTemplate from './pages/Project/CreateTemplate';
import CICDListPage from './pages/Project/CICDListPage';

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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '',
        element: <ProjectPage />,
      },
      {
        path: '/projects',
        element: <ProjectPage />,
      },
      {
        path: '/projects/:projectName',
        element: <ProjectPage />,
      },
      {
        path: '/projects/:projectName/editor',
        element: <EditorPage />,
      },
      {
        path: '/projects/:projectName/commitHistory',
        element: <CommitHistory />,
      },
      {
        path: '/projects/:projectName/details/*',
        element: <ProjectDetailPage />,
      },
      {
        path: '/projects/:projectName/cicdList',
        element: <CICDListPage />,
      },
      {
        path: '/projects/:projectName/details/:reference/*',
        element: <ProjectDetailPage />,
      },
      {
        path: '/create',
        element: <Create />,
      },
      {
        path: '/create/blank',
        element: <CreateBlank />,
      },
      {
        path: '/create/fromTemplate',
        element: <CreateTemplate />,
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
