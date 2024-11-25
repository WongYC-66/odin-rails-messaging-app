import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout"
import Error from "../layout/Error"

import App, { loader as AppLoader } from "../components/App";
import SignUp, { action as signUpAction } from '../pages/SignUp.jsx'
import SignIn, { action as signInAction } from '../pages/SignIn.jsx'
import {
    loader as WindowChatLoader,
    action as WindowChatAction,
} from '../pages/WindowChat.jsx'
import { loader as WindowProfileLoader } from '../pages/WindowProfile.jsx'
import {
    loader as WindowProfileEditLoader,
    action as WindowProfileEditAction,
} from '../pages/WindowProfileEdit.jsx'

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
                        path: '/chat/:chat_id',
                        element: <App />,
                        loader: WindowChatLoader,
                        action: WindowChatAction,
                    },
                    {
                        path: '/profile/:username',
                        element: <App />,
                        loader: WindowProfileLoader,
                    },
                    {
                        path: '/profile/:username/edit',
                        element: <App />,
                        loader: WindowProfileEditLoader,
                        action: WindowProfileEditAction,
                    },

                    {
                        path: '/sign-up',
                        element: <SignUp />,
                        action: signUpAction,
                    },
                    {
                        path: '/sign-in',
                        element: <SignIn />,
                        action: signInAction,
                    },
                    {
                        path: "*",
                        element: <Error />,
                    },
                ]
            }
        ]
    },

]);

export default myRouter