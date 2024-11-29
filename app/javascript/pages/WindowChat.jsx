import React from "react";

import { Form, redirect, useLoaderData } from "react-router-dom";

import UserListModal from "../components/UserListModal.jsx"
import LastLoginDot from "../components/LastLoginDot"

import { loader as AppLoader } from "../components/App.jsx"
import API_URL from "../layout/API_URL.jsx"


export default function WindowChat() {
    const { chatsInfo } = useLoaderData()

    const self = JSON.parse(localStorage.getItem('user'))

    if (chatsInfo) {
        var selfId = chatsInfo.users.find(user => user.username == self.username).id
        if (chatsInfo.isGroupChat) {
            var roomName = chatsInfo.name
        } else {
            const username = localStorage.getItem('user').username
            const { firstName, lastName } = chatsInfo.users.find(user => user.username != self.username)
            var oppositeUser = chatsInfo.users.find(user => user.username !== self.username)
            var roomName = `${firstName} ${lastName}`
            // https://ui-avatars.com/
            var iconURL = `https://ui-avatars.com/api/?background=random&name=${firstName}+${lastName}`
        }
    }

    return (
        <div className="bg-light bg-gradient flex-shrink-1 p-3 w-50 rounded border border-1 d-flex flex-column">
            {!chatsInfo && <p>Loading chats ... </p>}
            {chatsInfo &&
                < div className="flex-fill border border-1 d-flex flex-column p-3">
                    {/* Chat target / Group Name */}
                    <div className="d-flex justify-content-around align-items-center text-center bg-primary text-white py-1">
                        <UserListModal allProfile={chatsInfo.users} />
                        <h4>{roomName}</h4>
                        {!chatsInfo.isGroupChat && <LastLoginDot user={oppositeUser} />}
                    </div>

                    <div className="flex-grow-1 overflow-y-scroll" style={{ maxHeight: "55vh" }}>
                        {chatsInfo.messages.map(({ text, timestamp, user }, i) => {
                            const iconURL = `https://ui-avatars.com/api/?background=random&name=${user.firstName}+${user.lastName}`
                            const isOther = user.username != self.username
                            return (
                                <div key={text + i}>
                                    {/* other's icon, name and message */}
                                    {isOther &&
                                        <div className="d-flex my-2" >
                                            <img src={iconURL} className="mx-3 rounded-circle" width="35px" height="35px"></img>
                                            <div className="d-flex flex-column">
                                                {chatsInfo.isGroupChat && <p className="m-0 p-0">{user.firstName + " " + user.lastName}</p>}
                                                <p className="m-0 p-0 pe-3">{text}</p>
                                            </div>
                                        </div>
                                    }
                                    {/* self message */}
                                    {
                                        !isOther &&
                                        <div className="d-flex my-2 mx-3 justify-content-end">
                                            <span className="text-bg-primary text-white rounded-3 py-2 px-3 text-wrap" style={{ display: "inline-block" }}> {text} </span>
                                        </div>
                                    }
                                </div>
                            )
                        })}
                    </div >

                    {/* textarea input and send button */}
                    < Form method="POST" >
                        <div className="d-flex w-100 mt-5">
                            <textarea className="flex-fill" placeholder=" enter your message here ..." style={{ resize: 'none' }} id="textInput" name="text" required></textarea>
                            <input type="text" name="userId" defaultValue={selfId} hidden />
                            <button className="btn btn-primary ms-3" type="submit">send</button>
                        </div>
                    </Form>


                </div>
            }
        </div >
    );
}

export async function loader({ params }) {
    const { chat_id } = params

    const fetchChatInfo = async () => {
        const user = JSON.parse(localStorage.getItem('user'));

        const myHeaders = new Headers();
        const token = user.token

        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);


        const response = await fetch(`${API_URL}/api/v1/chats/${chat_id}`, {
            method: "GET",
            headers: myHeaders,
        })

        const { status } = await response.json()
        // console.log(status.data?.chat)

        if (status && status.data?.chat)
            return status.data.chat

        console.error('fetch chat by chat_id failed ...')
        return []
    }

    const [{ allChat, allProfile }, chatsInfo] = await Promise.all([AppLoader(), fetchChatInfo()])

    return { allChat, allProfile, chatsInfo }

}

export async function action({ request, params }) {
    // POST new msg action
    const { chat_id } = params

    const formData = await request.formData();
    const messageInfo = Object.fromEntries(formData);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token

    const myHeaders = new Headers();
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("X-CSRF-Token", csrfToken);

    const response = await fetch(`${API_URL}/api/v1/chats/${chat_id}/`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(messageInfo),
    });

    
    // clear textarea input
    document.getElementById('textInput').value = ""
    
    let {status} = await response.json()
    if (status && status.data?.chat)
        return redirect(`/chat/${chat_id}`);

    // Return the error data instead of redirecting, capturable at useActionData
    return {
        error: data.error || 'Unknown error occurred'
    };
}