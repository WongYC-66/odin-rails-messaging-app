import React from "react";
import { redirect, useLoaderData, useActionData, Form } from "react-router-dom";

import { loader as AppLoader } from "../components/App.jsx"
import API_URL from "../layout/API_URL.jsx"

export default function WindowProfileEdit(props) {

    const { userEditProfile } = useLoaderData()

    const actionData = useActionData();

    const first = userEditProfile ? userEditProfile.firstName : ''
    const last = userEditProfile ? userEditProfile.lastName : ''

    const iconURL = `https://ui-avatars.com/api/?background=random&name=${first}+${last}`

    return (
        <div className="bg-light bg-gradient flex-shrink-1 p-3 w-50 rounded border border-1 d-flex flex-column">

            {/* Profile */}

            {userEditProfile &&
                < div className="flex-fill border border-1 d-flex flex-column p-3">

                    {actionData && actionData.error && <h5 className="text-danger">{actionData.error} </h5>}

                    <Form method="PUT">
                        <div className="flex-fill">
                            <div className="d-flex align-items-center mt-5">
                                <img src={iconURL} className="mx-3 rounded-circle" width="100px" height="100px"></img>
                                <div className="d-flex flex-column">
                                    {/* firstName Input */}
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="firstName" name="firstName" placeholder="" defaultValue={first} />
                                        <label htmlFor="firstName">First Name</label>
                                    </div>
                                    {/* lastName Input */}
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="lastName" name="lastName" placeholder="" defaultValue={last} />
                                        <label htmlFor="lastName">Last Name</label>
                                    </div>
                                    <h6>{`@${userEditProfile.username}`}</h6>
                                </div>
                            </div>

                            <hr />
                            {/* Email Input */}
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="email" name="email" placeholder="" defaultValue={userEditProfile.email} />
                                <label htmlFor="email">Email</label>
                            </div>

                            <p className="fst-italic">Description : </p>
                            {/* Description Input */}
                            <div className="form-floating mb-3">
                                <textarea type="email" className="form-control" id="description" name="description" placeholder="" defaultValue={userEditProfile.description} style={{ height: '125px' }} />
                                <label htmlFor="email"> ... your's description ...</label>
                            </div>


                        </div>

                        {/* Buttons - Edit My Profile , Send Message */}
                        <div className="d-flex justify-content-evenly align-items-center p-3">
                            <button type="submit" className="btn btn-primary">Update</button>
                        </div>
                    </Form>
                </div>
            }

            {!userEditProfile && <p>Loading data ... </p>}
        </div >
    );
}

export async function loader({ params }) {
    const { username } = params

    const user = JSON.parse(localStorage.getItem('user'));

    const myHeaders = new Headers();
    const token = user.token

    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const fetchUserProfile = async () => {
        const response = await fetch(`${API_URL}/users/profile/${username}`, {
            method: "GET",
            headers: myHeaders,
        })

        const data = await response.json()
        if (data && data.queryUser)
            return data.queryUser

        console.error('fetch profile by username failed ...')
        return []
    }

    const [{ allChat, allProfile }, userEditProfile] = await Promise.all([AppLoader(), fetchUserProfile()])

    return { allChat, allProfile, userEditProfile }
}

export async function action({ request }) {
    const formData = await request.formData();
    const userInfo = Object.fromEntries(formData);
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_URL}/users/profile/${user.username}/`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(userInfo),
    });

    let data = await response.json()

    if (data && data.updatedUser) {
        return redirect(`/profile/${user.username}`);
    }

    // Return the error data instead of redirecting, capturable at useActionData
    return {
        error: data.error || 'Unknown error occurred'
    };
}