import React from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import Dashboard from "./Dashboard";
import '../css/bitacora.css'

const Bitacora = ({user, setUser}) => {
    return(
        <div>
            <Dashboard user={user} setUser={setUser}/>
            <div className="content">
                <form action="">
                    <h3>Selecione la fecha que desea</h3>
                    <input type="date" name="" id="" required/>
                    <button className="btn btn-danger"><FaRegFilePdf/> Generar</button>
                </form>
            </div>
        </div>
    )
}

export default Bitacora