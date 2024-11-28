import React from "react";

import { Form, Link, redirect, useActionData } from "react-router-dom";
import API_URL from "../layout/API_URL.jsx"

export default function SignUp() {

    const actionData = useActionData();

    return (
        <div className="">

            <h1 className="text-primary mb-3">Create new account </h1>
            <h2 className="text-info mb-5">Connect easily to your friends</h2>

            {actionData && actionData.error && <h5 className="text-danger">{actionData.error} </h5>}

            <Form method="POST">
                <div className="form-floating my-3">
                    <input type="text" className="form-control" id="firstName" name='firstname' placeholder="" required />
                    <label htmlFor="firstName">First Name</label>
                </div>

                <div className="form-floating my-3">
                    <input type="text" className="form-control" id="lastName" name='lastname' placeholder="" required />
                    <label htmlFor="lastName">Last Name</label>
                </div>

                <div className="form-floating my-3">
                    <input type="text" className="form-control" id="username" name='username' placeholder="" required />
                    <label htmlFor="username">username</label>
                </div>

                <div className="form-floating my-3">
                    <input type="email" className="form-control" id="email" name='email' placeholder="john_doe@example.com" required />
                    <label htmlFor="email">email</label>
                </div>

                <div className="form-floating my-3">
                    <input type="password" className="form-control" id="password" name="password" placeholder="" required />
                    <label htmlFor="password">Password</label>
                </div>

                <div className="form-floating my-3">
                    <input type="password" className="form-control" id="confirmPassword" name="password_confirmation" placeholder="" required />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                </div>

                <button type="submit" className="btn btn-primary my-3">Sign Up</button>

            </Form>

            <p className="mt-3">
                <span className="my-1"> Already have an account ? </span>
                <Link to={"/"} className="text-decoration-none">
                    Log in
                </Link>

            </p>
        </div>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const userInfo = Object.fromEntries(formData);

    const myHeaders = new Headers();
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-CSRF-Token", csrfToken);

    const response = await fetch(`${API_URL}/users/sign_up/`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({user: userInfo}),
    });

    let { status } = await response.json()
    console.log(status)
    // valid
    if (status.data?.user) {
        console.log(status.message)
        const jwt = response.headers.get("Authorization").split(" ")[1]; // Extract Bearer token
        localStorage.setItem('user', JSON.stringify({
            username: status.data.user.username,
            token: jwt
        }))
        return redirect('/')
    }

    // Return the error data instead of redirecting, capturable at useActionData
    return { error: status.message || 'Unknown error occurred' }
}