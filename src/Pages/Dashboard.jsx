import React from "react";
import { Link } from "react-router-dom";
import { FaSackDollar,FaChartColumn,FaFile ,FaUser, FaRightFromBracket, FaHouse } from "react-icons/fa6";
import '../css/dashboard.css'

const Dashboard = ({ user, setUser }) => {

    const logout = () => setUser(null)

    const id = user.idCliente

    return(
        <div>
            <div>
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to={"/dashboard"}><h5><span><FaHouse/> ROSMO COIN</span></h5></Link>
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
            <div><h1 className="titulo">Bienvenido {user.nombreCliente}</h1></div>
            <div className="botones-accion">
                {/*<Link className="btn btn-outline-success tarjeta" to={'/dashboard/' + id + '/materiales'}>
                    <span><h4><FaScrewdriverWrench/> Materiales</h4></span>
                </Link>*/}
                <Link className="btn btn-outline-success tarjeta" to={'/dashboard/' + id + '/gastos'}>
                    <span><h4><FaSackDollar/> Gastos</h4></span>
                </Link>
                <Link className="btn btn-outline-warning tarjeta" to={'/dashboard/' + id + '/graficas'}>
                    <span><h4><FaChartColumn/> Graficas</h4></span>
                </Link>
                <Link className="btn btn-outline-primary tarjeta" to={'/dashboard/' + id + '/bitacora'}>
                    <span><h4><FaFile/> Bitacoras</h4></span>
                </Link>
            </div>
        </div>
    )
}

export default Dashboard