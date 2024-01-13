import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";

import HomePage from './home_page/HomePage';
import ErrorPage from './error_page/ErrorPage';
import RouteErrorPage from './error_page/RouteErrorPage';

// 定义多页面的路由
const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>,
        errorElement: <RouteErrorPage/>,
    },
    {
        path: "/error",
        element: <ErrorPage/>,
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
