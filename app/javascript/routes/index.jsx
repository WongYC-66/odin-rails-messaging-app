import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout"
import Error from "../layout/Error"

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
                        element: <div> hi </div>,
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