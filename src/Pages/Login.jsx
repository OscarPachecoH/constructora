import axios from "axios";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { FaRegEnvelope, FaLock } from "react-icons/fa6";
import Logo from '../Images/logo.jpg'
import '../css/login.css'

const LoginShow = ({setUser}) => {

    const form = useRef()

    const [sesionErrorCV, setSesionErrorCV] = useState(false)
    const [sesionErrorP, setSesionErrorP] = useState(false)
    const [recuperarError, setErrorR] = useState(false)

    const [recuperarSuccess, setSuccessR] = useState(false)

    const [recuperar, setRecupera] = useState({
        user_email: ''
    })

    const inputChange2 = ({target}) => {
        const {name, value} = target
        setRecupera({
            ...recuperar,
            [name]: value
        })
    }

    const enviarEmail = () => {
        emailjs.sendForm('service_cse3y8o', 'template_qtlqn5o', form.current, 'yfNAvbGT75WmmKIYJ')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        })
    }

    const cambiar = async (e) => {
        e.preventDefault()
        if(recuperar.user_email !== ''){
            await axios.post('http://localhost:9000/recuperarcontra', recuperar)
            .then(({data}) => {
                if(data.message === 'Cambio realizado'){
                    enviarEmail();
                    //alert('Se envio el correo')
                    setErrorR(false)
                    setSuccessR(true)
                }
            })
        }else{
            setErrorR(true)
        }
    }

    const [sesion, setSesion] = useState({
        correo: '',
        contraseña: ''
    })

    const navigate = useNavigate()

    const inputChange = ({target}) =>{
        const {name, value} = target
        setSesion({
            ...sesion,
            [name]: value
        })
    }

    const iniciar = async (e) => {
        e.preventDefault()
        if(sesion.correo !== '' && sesion.contraseña !== ''){
            
            await axios.post('http://localhost:9000/login', sesion)
            .then(({data}) => {
                if(data.estadoUsuario === 0){
                    alert("El usuario no tiene una obra activa")
                }else{
                    setUser(data)
                    navigate('/dashboard')
                }
            })
            .catch(({response}) => {
                if(response.data.message === 'Cliente no encontrado'){
                    alert('No hay un registro con este correo')
                    setSesion({...sesion, correo:'', contraseña:''})
                }else if(response.data.message === 'Contraseña incorrecta'){
                    //alert('Error... Verifique sus datos')
                    setSesionErrorP(true)
                    setSesion({...sesion, correo:'', contraseña:''})
                }
                console.log(response.data.message)
            })
        }else {
            setSesionErrorCV(true)
            setSesionErrorP(false)
        }
        if(sesion.contraseña !== '' && sesion.contraseña.length <= 7){
            //alert('La contraseña debe ser mayor a 7 caracteres')
            setSesionErrorCV(false)
            setSesionErrorP(true)
        }
    }

    return (
        <div className="body">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-5 col-mb-6 form-container">
                        <div className="col-lg-8 col-md-12 col-sm-9 col-xs-12 form-box text-center">
                            <div className="logo mt-5 mb-3">
                                <img src={Logo} width={'250px'} alt="ROSMO COIN"/>
                            </div>
                            <div className="heading mb-3">
                                <h4>Inicio de sesión</h4>
                            </div>
                            <form onSubmit={iniciar}>
                                <div className="form-input">
                                    <span><FaRegEnvelope/></span>
                                    <input 
                                        type="email" 
                                        id="correro"
                                        placeholder="Correo electronico"
                                        name="correo" 
                                        value={sesion.correo}
                                        onChange={inputChange}
                                        />
                                </div>
                                <div className="form-input">
                                    <span><FaLock/></span>
                                    <input 
                                        type="password" 
                                        id="contraseña"
                                        name="contraseña"
                                        placeholder="Contraseña"
                                        value={sesion.contraseña}
                                        onChange={inputChange}
                                        />
                                    {
                                        sesionErrorCV &&
                                        <div className="alert alert-danger">
                                            Hay un error... Los campos son obrigatorios
                                        </div>
                                    }
                                    {
                                        sesionErrorP &&
                                        <div className="alert alert-danger">
                                            <h9>Ups... Verifique que sus datos sean correctos</h9>
                                        </div>
                                    }
                                </div>
                                <div className="text-left">
                                    <button className="btn" type="submit">Entrar</button>
                                </div>
                            </form>
                            {/*<Link to="/recuperar">Olvide mi contraseña</Link>*/}
                            <Link data-bs-toggle="modal" data-bs-target="#exampleModalCenter">
                                Olvide mi contraseña
                            </Link>
                        </div>
                        
                        <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title text-center" id="exampleModalLongTitle">Recuperar contraseña</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                <div className="modal-body text-center">
                                    <form onSubmit={cambiar} ref={form}>
                                        <div>
                                            <label htmlFor="">Correo Electronico: </label>
                                            <input 
                                                type="email" 
                                                name="user_email" 
                                                id="" 
                                                value={recuperar.user_email}
                                                onChange={inputChange2}
                                            />
                                            {
                                                recuperarError &&
                                                <div className="alert alert-danger">
                                                    Hay un error... Los campos son obrigatorios
                                                </div>
                                            }
                                            {
                                                recuperarSuccess &&
                                                <div className="alert alert-success">
                                                    Correo Enviado
                                                </div>
                                            }
                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn-enviar" type="submit">Enviar</button>
                                            <button type="button" className="btn-cancelar" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </form>
                                </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 col-md-6 d-none d-md-block image-container"></div>
                </div>
            </div>
        </div>
    );
}

export default LoginShow