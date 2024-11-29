import React from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";

import { loader as AppLoader } from "../components/App.jsx"
import API_URL from "../layout/API_URL.jsx"

export default function WindowProfile(props) {
    const navigate = useNavigate();
    const { userProfile } = useLoaderData()

    const first = userProfile ? userProfile.firstName : ''
    const last = userProfile ? userProfile.lastName : ''

    const iconURL = `https://ui-avatars.com/api/?background=random&name=${first}+${last}`

    const self = JSON.parse(localStorage.getItem('user'))

    const setUserSelection = props.setUserSelection

    const editBtnOnClick = () => {
        setUserSelection({
            type: 'profileEdit'
        })
    }

    const HandleSendMsgBtnClick = async () => {

        const targetUserId = userProfile.id

        const self = JSON.parse(localStorage.getItem('user'));

        const myHeaders = new Headers();
        const token = self.token
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content

        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("X-CSRF-Token", csrfToken);

        // get self userId first
        const responseId = await fetch(`${API_URL}/api/v1/users/${self.username}`, {
            method: "GET",
            headers: myHeaders,
        })

        const { status : statusId } = await responseId.json()
        
        if (statusId && statusId.data?.queryUser) {
            var selfUserId = statusId.data.queryUser.id
            // console.log(statusId)
        } else {
            return console.error(statusId.message)
        }

        // POST a new chat room
        const response = await fetch(`${API_URL}/api/v1/chats/`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                userIds: [targetUserId, selfUserId],
                isGroupChat: false,
            })
        })

        // if no error, redirect to corresponding chat window

        const { status } = await response.json()
        // console.log(status)
        if (status && status.data?.chat) {
            let chat = status.data.chat
            setUserSelection({
                type: 'chat',
                id: chat.id,
            })
            return navigate(`/chat/${chat.id}`);
        }

        return console.error(status.message)
    }

    return (
        <div className="bg-light bg-gradient flex-shrink-1 p-3 w-50 rounded border border-1 d-flex flex-column">

            {/* Profile */}
            {userProfile &&
                < div className="flex-fill border border-1 d-flex flex-column p-3">
                    <div className="flex-fill">
                        <div className="d-flex align-items-center mt-5">
                            <img src={iconURL} className="mx-3 rounded-circle" width="100px" height="100px"></img>
                            <div className="d-flex flex-column">
                                <h5>{`${first} ${last}`}</h5>
                                <h6>{`@${userProfile.username}`}</h6>
                            </div>
                        </div>

                        <hr />
                        <p>Email : {userProfile.email}</p>
                        <p className="fst-italic">Description : </p>
                        <p>{userProfile.description}</p>


                    </div>

                    {/* Buttons - Edit My Profile , Send Message */}
                    <div className="d-flex justify-content-evenly align-items-center p-3">
                        <Link to={`/profile/${self.username}/edit`} onClick={editBtnOnClick}>
                            <button type="button" className="btn btn-danger">Edit My Profile</button>
                        </Link>
                        <button type="button" className="btn btn-primary" onClick={HandleSendMsgBtnClick}>Send a message</button>
                    </div>
                </div>
            }

            {!userProfile && <p>Loading data ... </p>}
        </div >
    );
}

export async function loader({ params }) {
    const { username } = params

    const fetchUserProfile = async () => {
        const user = JSON.parse(localStorage.getItem('user'));

        const myHeaders = new Headers();
        const token = user.token

        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);


        const response = await fetch(`${API_URL}/api/v1/users/${username}`, {
            method: "GET",
            headers: myHeaders,
        })

        const { status } = await response.json()
        // console.log(status.data.allUsers)

        if (status && status.data?.queryUser)
            return status.data?.queryUser

        console.error('fetch profile by username failed ...')
        return {}
    }

    const [{ allChat, allProfile }, userProfile] = await Promise.all([AppLoader(), fetchUserProfile()])

    return { allChat, allProfile, userProfile }
}