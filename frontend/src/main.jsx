import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Login from './Login'
import CreateUser from './CreateUser'
import StatusList from './StatusList'
import CreateStatus from './CreateStatus'
import UserProfile from './UserProfile'
import App from './App'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <StatusList />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <CreateUser />
      },
      {
        path: "/create-status",
        element: <CreateStatus />
      },
      {
        path: "/user/:username",
        element: <UserProfile />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
);
