// import 'bootstrap-icons/font/bootstrap-icons.css';
import React from "react";

export default function UserListModal(props) {

    // Modal To Show Use rList In a Group Chat
    const allProfile = props.allProfile

    const self = JSON.parse(localStorage.getItem('user'))

    return (
        <>
            {/* <!-- Button trigger modal --> */}
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop2">
                <i className="bi bi-person-vcard"></i>
            </button>

            {/* <!-- Modal --> */}
            <div className="modal fade" id="staticBackdrop2" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel2" aria-hidden="true">
                <div className="modal-dialog text-black">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel2">Users</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <ul className="list-group">
                                {allProfile.map(user =>
                                    <li key={user.id} className="list-group-item" >
                                        {user.firstName + " " + user.lastName}
                                        {user.username == self.username && ` (me)`}
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}