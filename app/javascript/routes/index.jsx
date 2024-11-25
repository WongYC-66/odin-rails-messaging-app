import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout"
import Error from "../layout/Error"

import App, { loader as AppLoader } from "../components/App";
import SignUp, { action as signUpAction } from '../pages/SignUp.jsx'
import SignIn, { action as signInAction } from '../pages/SignIn.jsx'

const myRouter = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <Error />, 
        children: [
            {
                errorElement: <Error />,        // error page, preserving Root UI
                children: [
                    {
                        index: true,
                        element: <App />,
                        loader: AppLoader,
                    },
                    {
                        path: "*",
                        element: <Error />,
                    },
                    {
                        path: 'sign-up',
                        element: <SignUp />,
                        action: signUpAction,
                    },
                    {
                        path: 'sign-in',
                        element: <SignIn />,
                        action: signInAction,
                    },
                ]
            }
        ]
    },

]);

export default myRouter