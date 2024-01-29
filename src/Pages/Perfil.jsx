import React, { useState } from "react";
import axios from "axios";
import '../css/perfil.css'
import { Link } from "react-router-dom";
import { FaUser, FaRightFromBracket, FaHouse, FaLock } from "react-icons/fa6";

const Perfil = ({user, setUser}) => {

    const id = user.idCliente;

    const [cambioError1, setCambioError1] = useState(false);
    const [cambioError2, setCambioError2] = useState(false);

    const logout = () => setUser(null)

    const [cambioContra, setContraseña] = useState({
        antiguaContraseña: '',
        nuevaContraseña: '',
        confnuevaContraseña: ''
    })

    const inputChange = ({target}) => {
        const {name, value} = target
        setContraseña({
            ...cambioContra,
            [name]: value
        })
    }

    const cambio = async (e) => {
        e.preventDefault()
        //console.log(cambioContra)
        if(cambioContra.nuevaContraseña !== cambioContra.confnuevaContraseña){
            //alert('Las contraseñas no coinciden')
            setCambioError2(true);
            setTimeout(() => setCambioError2(false), 3000);
        }else{
            await axios.patch('http://localhost:9000/cambiocontra/' + id, cambioContra)
            .then(({data}) => {
                console.log(data);
                if(data.message === 'No hubo cambios'){
                    alert('No hubo cambios')
                }else{
                    alert('Se cambio la contraseña')
                }
            })
            .catch(({response}) => {
                //alert('Error... Revise su contraseña antigua')
                setCambioError1(true);
                setTimeout(() => setCambioError1(false), 3000);
                console.log(response.data);
            })
        }
        
    }

    return(
        <div className="body">
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
            <div className="container-fluid">
                <div className="col-lg-19 col-mb-4 form-container-settings">
                    <div className="col-lg-8 col-md-24 col-sm-9 col-xs-12 form-box text-center">
                        <h2>Datos generales</h2>
                        <label htmlFor="">Nombre:</label>
                        <input type="text" disabled placeholder={user.nombreCliente}/>
                        <label htmlFor="">Apellido Paterno:</label>
                        <input type="text" disabled placeholder={user.apellidoPCliente}/>
                        <label htmlFor="">Apellido Materno:</label>
                        <input type="text" disabled placeholder={user.apellidoMCliente}/>
                        <form onSubmit={cambio}>
                            <h3>Cambiar contraseña</h3>
                            <div className="form-input">
                                <span><FaLock/></span>
                                <input 
                                    type="password" 
                                    name="antiguaContraseña"
                                    placeholder="Contraseña actual"
                                    value={cambioContra.antiguaContraseña}
                                    onChange={inputChange}
                                    required
                                />
                                {
                                    cambioError1 &&
                                    <div className="alert alert-danger">
                                        Error... Revise su contraseña antigua
                                    </div>
                                }
                            </div>
                            <div className="form-input">
                                <span><FaLock/></span>
                                <input 
                                    type="password" 
                                    name="nuevaContraseña"
                                    placeholder="Contraseña nueva" 
                                    value={cambioContra.nuevaContraseña}
                                    onChange={inputChange}
                                    required
                                />
                            </div>
                            <div className="form-input">
                                <span><FaLock/></span>
                                <input 
                                    type="password" 
                                    name="confnuevaContraseña"
                                    placeholder="Confirmar contraseña nueva" 
                                    value={cambioContra.confnuevaContraseña}
                                    onChange={inputChange}
                                    required
                                />
                            </div>
                            {
                                cambioError2 &&
                                <div className="alert alert-danger">
                                    Error... Las contraseñas no coinciden
                                </div>
                            }
                            <button className="btn btn-success">Cambiar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default Perfil