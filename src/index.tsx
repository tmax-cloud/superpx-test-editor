import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.css';
import './404.scss';
import { setupLanguage } from './java/setup';
import { GNB } from './components/GNB/GNB';
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from 'react-router-dom';
import { BaseAlert } from './components/Alert/Alert';
import Main from './components/Main';
import { NotFound } from './components/ErrorPage/404';
import WorkspaceStore from './stores/workspaceStore';
import AboutPage from './pages/AboutPage';
import ProjectPage from './pages/Project/ProjectPage';
import ProjectDetailPage from './pages/Project/ProjectDetailPage';
import Button from '@mui/material/Button';

WorkspaceStore.setupWsAction();
setupLanguage();

const App = () => {
  return (
    <>
      <BaseAlert />
      <GNB />
      <div className="content">
        <Link to="/">
          <Button>Home</Button>
        </Link>
        <Link to="/projects">
          <Button>Projects</Button>
        </Link>
        <Link to="/editor">
          <Button>Editor</Button>
        </Link>
        <Link to="/about">
          <Button>About</Button>
        </Link>
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
        path: 'projects',
        element: <ProjectPage />,
      },
      {
        path: 'projects/:projectName',
        element: <ProjectDetailPage />,
      },
      {
        path: 'projects/:projectName/editor',
        element: <Main />,
      },
      {
        path: 'editor',
        element: <Main />,
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
