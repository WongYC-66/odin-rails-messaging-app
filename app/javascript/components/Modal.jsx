import React from "react";
import { useNavigate } from 'react-router-dom'

import LastLoginDot from "./LastLoginDot"
import API_URL from "../layout/API_URL.jsx"

export default function Modal(props) {

    // Pop up modal, select users to join new group chat
    // once created, redirected to that.
    const navigate = useNavigate()

    const allProfile = props.allProfile
    const setUserSelection = props.setUserSelection

    const handleCreateBtnClick = async () => {

        const groupNameInput = document.getElementById('groupName')
        const groupName = groupNameInput.value
        groupNameInput.value = ""       // reset input
        if (!groupName) {
            alert("Please enter group chat name")
            groupNameInput.focus()
            return
        }

        const inputNodes = document.querySelectorAll('input.form-check-input')
        const userIds = [...inputNodes]
            .reduce((arr, node) => {
                node.checked ? arr.push(node.value) : null
                return arr
            }, [])
            .map(Number);
        [...inputNodes].forEach(node => node.checked = false)      // reset input


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
                userIds: [...userIds, selfUserId],
                isGroupChat: true,
                groupName: groupName,
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
        // < !--Vertically centered scrollable modal-- >
        <>
            {/* <!-- Button trigger modal --> */}
            <button type="button" className="btn btn-primary d-block mx-auto my-3" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Create Group Chat
            </button>

            {/* <!-- Modal --> */}
            <form>
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                {/* <h1 className="modal-title fs-5" id="staticBackdropLabel">Select users to join ... </h1> */}

                                {/* Input Group Chat Name */}
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="groupName" name="groupName" placeholder="" required />
                                    <label htmlFor="groupName">enter group chat name here ...</label>
                                </div>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">


                                {/* Checkboxes */}
                                {allProfile.map(user =>
                                    <div key={user.id} className="input-group my-1">
                                        <div className="input-group-text">
                                            <input className="form-check-input mt-0 me-3" type="checkbox" value={user.id} name={user.id} />
                                            <LastLoginDot user={user}/>
                                            <span className='ms-3'>{user.firstName + " " + user.lastName}</span>
                                        </div>
                                    </div>
                                )}

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleCreateBtnClick}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>


        </>
    );
}