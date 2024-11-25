import React from "react";
import { Form, Link, redirect, useActionData } from "react-router-dom";

import API_URL from "../layout/API_URL.jsx"

export default function SignIn() {

    const actionData = useActionData();

    return (
        <div className="">
            <h1 className="text-primary">Hang out </h1>
            <h2 className="text-info">whenever,</h2>
            <h2 className="text-primary-emphasis mb-5">wherever</h2>

            <p className="text-primary-emphasis mb-3 w-50">MessageMe makes it easy to send a chat message to your friend or even a stranger! </p>

            {actionData && actionData.error && <h5 className="text-danger">{actionData.error} </h5>}

            <Form method="POST">
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="username" name='username' placeholder="" required />
                    <label htmlFor="username">username</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="password" name="password" placeholder="" required />
                    <label htmlFor="password">Password</label>
                </div>

                <button type="submit" className="btn btn-primary my-3">Log in</button>
            </Form>

            {/* Visitor Log-in Feature */}
            <Form method="POST" className="d-inline-block">
                <input type="text" name='username' defaultValue="guest" hidden/>
                <input type="password" name="password" defaultValue="guest" hidden/>
                <button type="submit" className="btn btn-primary my-3">or Guest Login</button>
            </Form>

            <p className="mt-3">
                <span className="my-1"> Doesn't have account ? </span>
                <Link to={"../sign-up"} className="text-decoration-none">
                    Sign Up here
                </Link>

            </p>
        </div>
    );
}

export async function action({ request }) {

    const formData = await request.formData();
    const userInfo = Object.fromEntries(formData);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const response = await fetch(`${API_URL}/users/sign-in/`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(userInfo),
    });

    let data = await response.json()

    if (data && data.token) {
        localStorage.setItem('user', JSON.stringify({
            username: userInfo.username,
            token: data.token
        }))
        return redirect('/')
    }

    // Return the error data instead of redirecting, capturable at useActionData
    return {
        error: data.error || 'Unknown error occurred'
    };
}