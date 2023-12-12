import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaRightFromBracket, FaAnglesRight, FaHelmetSafety } from "react-icons/fa6";
import '../css/dashboard.css'

const Lista = ({user, setUser}) => {

    const [obras, setObras] = useState([])

    const logout = () => setUser(null)

    useEffect(() => {
        getObras()
    }, [])

    const getObras = async () => {
        const response = await axios.get('http://localhost:9000/obra/' + user.idCliente)
        setObras(response.data)
    }

    return(
        <div>
            <div>
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid">
                        <Link className="navbar-brand"><h5><span><FaHelmetSafety/> ROSMO COIN</span></h5></Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {user.nombreCliente} {user.apellidoPCliente} {user.apellidoMCliente}
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item" to={'/perfil'}><span><FaUser/> Perfil</span></Link></li>
                                        <li><hr className="dropdown-divider"/></li>
                                        <li><Link className="dropdown-item" onClick={logout}><span><FaRightFromBracket/> Cerrar sesión</span></Link></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th className="titulo-tabla" colspan="5"><h4>Lista de obras</h4></th>
                    </tr>
                </thead>
                <tr>
                    <th>Nombre de obra</th>
                    <th>Acciones</th>
                </tr>
                {obras.map((obra) => (
                    <tr key={obra.idObra}>
                        <td>{obra.nombreObra}</td>
                        <td>
                            <Link 
                                className="btn btn-success" 
                                to={`/dashboard/${user.idCliente}/${obra.idObra}`}
                                
                                onClick={() => setUser({...user, idObra:obra.idObra})}
                            ><span>GESTIONAR <FaAnglesRight/></span></Link>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
        
    )
}

export default Lista