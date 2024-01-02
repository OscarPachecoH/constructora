import React from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import Dashboard from "./Dashboard";
import '../css/bitacora.css'

const Bitacora = ({user, setUser}) => {
    return(
        <div>
            <Dashboard user={user} setUser={setUser}/>
            <div className="content">
                <h1>En proceso...</h1>
            </div>
        </div>
    )
}

export default Bitacora