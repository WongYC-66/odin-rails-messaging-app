import React from "react";
import { Link } from "react-router-dom";

const groupChatIcon = '/images/group-chat.png'
import LastLoginDot from "./LastLoginDot"

export default function ChatCard(props) {
    const chat = props.chat

    const self = JSON.parse(localStorage.getItem('user'))

    if(chat.isGroupChat){
        var roomName = chat.name
    } else if(chat){
        const username = JSON.parse(localStorage.getItem('user')).username
        const {firstName, lastName} = chat.users.find(user => user.username != username)
        var oppositeUser = chat.users.find(user => user.username !== self.username)
        var roomName = `${firstName} ${lastName}`
        // https://ui-avatars.com/

        var iconURL = `https://ui-avatars.com/api/?background=random&name=${firstName}+${lastName}`
    }

    const userSelection = props.userSelection
    const setUserSelection = props.setUserSelection
    const isActive = userSelection.type === 'chat' && userSelection.id === chat.id

    const cardOnClick = () => {
        setUserSelection({
            type: 'chat',
            id: chat.id,
        })
    }

    return (
        <Link to={`/chat/${chat.id}`} className={`list-group-item list-group-item-action p-1 m-0 d-flex align-items-center ${isActive ? 'active' : ''}`} onClick={cardOnClick}>
            {!chat.isGroupChat && <LastLoginDot user={oppositeUser}/>}
            <img src={chat.isGroupChat ? groupChatIcon : iconURL} className="mx-3" width="50px" height="50px"></img>
            <div>
                <h5 className="">{roomName}</h5>
                <p className="text-break overflow-hidden" style={{maxHeight: "35px"}}>{chat.messages[0]?.text}</p>
            </div>
        </Link>
    );
}