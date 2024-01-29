import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf"
import 'jspdf-autotable'
import { FaRegFilePdf } from "react-icons/fa6";
import Dashboard from "./Dashboard";
import '../css/bitacora.css'
import Logo from '../Images/logo.jpg'
import Fondo from '../Images/fondoPDF.jpg'
import axios from "axios";

const Bitacora = ({ user, setUser }) => {

    const [errorFecha, setErrorFecha] = useState(false);

    const [fechaSelecionada, setFechaSelecionada] = useState({
        dia: ''
    })

    const [datosObra, setDatosObra] = useState()

    useEffect(() => {
        getDastosGeneralesObra()
    })

    const inputChange = ({ target }) => {
        const { name, value } = target
        setFechaSelecionada({
            ...fecha,
            [name]: value
        })
    }

    const getDastosGeneralesObra = async () => {
        const response = await axios.get('http://localhost:9000/obra/datosgenerales/' + user.idObra)
        setDatosObra(response.data)
    }

    const mostrar = async (e) => {
        e.preventDefault()

        const response = await axios.get('http://localhost:9000/bitacora/' + user.idObra + '/' + fechaSelecionada.dia)
        const doc = new jsPDF({format:"letter"});

        const nombreCliente = user.nombreCliente + " " + user.apellidoPCliente + " " + user.apellidoMCliente;
        const repreLegal = "ING. ROSALIO SUASTEGUI MOLINA";
        const repreObra = datosObra.residente;
        const nombreObra = datosObra.nombreObra;
        const ubicacionObra = datosObra.direccionObra;

        const imagenes = [];
        const comentarios = [];

        function plantilla() {
            doc.addImage(Fondo, "JPE", 0, 50, 200, 200);
            doc.setFontSize(20);
            doc.setTextColor(19, 43, 76);
            doc.setFont("times", "blod");
            doc.text("Bitacora de Obra", 80, 20);
            doc.setLineWidth(1.5);
            doc.line(10, 23, 200, 23);
            doc.addImage(Logo, "JPEG", 14, 24, 25, 25);
            doc.setFontSize(15);
            doc.text("Obra: ", 45, 30);
            doc.text(nombreObra, 60, 30);
            doc.text("Ubicación: ", 45, 35);
            doc.text(ubicacionObra, 70, 35);
            doc.text("Ciudad: Chilpancingo", 45, 40);
            doc.text("Estado: Guerrero", 45, 45);
            doc.setFontSize(10);
            doc.text("Fecha: ", 165, 45);
            doc.text(fecha(), 180, 45)
            doc.setLineWidth(1);
            doc.line(10, 50, 200, 50);

            //lineas verticales pie de pagina
            doc.line(10, 235, 10, 270);
            doc.line(73, 235, 73, 270);
            doc.line(139, 235, 139, 270);
            doc.line(200, 235, 200, 270);
            
            //lineas horizontales pie de pagina
            doc.line(10, 235, 200, 235);
            doc.line(10, 270, 200, 270);
            
            //textos de pie de pagina
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            
            doc.text("ELABORÓ:", 30, 240)
            doc.text(repreLegal,11, 260)

            doc.text("Vo. Bo.:", 100, 240)
            doc.text(repreObra.toUpperCase(), 79, 260)

            doc.text(nombreCliente.toUpperCase(), 146, 260)

            //linea para firma
            doc.setLineWidth(0.5);
            doc.line(12, 255, 70, 255)
            doc.line(76, 255, 135, 255)
            doc.line(142, 255, 196, 255)
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text("ROSMO COIN S.A. DE C.V.", 18, 245);
            doc.text("REPRESENTANTE LEGAL", 20, 265);
            doc.text("REPRESENTANTE DE OBRA", 83, 265);
            doc.text("DUEÑO DE OBRA", 155, 265);
        
            doc.setFontSize(12)
        }

        if(response.data.length <= 0){
            setErrorFecha(true);
            setTimeout(() => setErrorFecha(false), 3000);
        }else{
            for(let i = 0; i < response.data.length; i++){
                imagenes.push('/images/' + response.data[i].nombreImg);
                comentarios.push(response.data[i].comentario);
            }
    
            const agregarGrupoDeImagenesAPagina = (grupo) => {
                grupo.forEach((imagen, index) => {
                    const x = (index % 2) * 100 + 15;
                    const y = Math.floor(index / 2) * 80 + 59;
                    doc.addImage(imagen, 'JPEG', x, y, 80, 65);
                });
            };
    
            const agregarGrupoDeComentariosAPagina = (grupo) => {
                grupo.forEach((comentario, index) => {
                    const x = (index % 2) * 100 + 15;
                    const y = Math.floor(index / 2) * 80 + 130;
                    doc.text(comentario, x, y);
                });
            };
    
            for (let i = 0; i < imagenes.length; i += 4) {
                plantilla();
                const grupo = imagenes.slice(i, i + 4);
                const grupo2 = comentarios.slice(i, i + 4);
                agregarGrupoDeImagenesAPagina(grupo);
                agregarGrupoDeComentariosAPagina(grupo2);
                if (i + 4 < imagenes.length) {
                    doc.addPage();
                }
            }
    
            doc.output('dataurlnewwindow', {
                filename: 'bitacora.pdf'
            })
        }
    }

    function fecha() {
        const date = new Date();

        const dia = date.getDate()
        const mes = date.getMonth()
        const anio = date.getFullYear()

        const fecha = dia + "/" + (mes + 1) + "/" + anio

        return fecha
    }

    return (
        <div>
            <Dashboard user={user} setUser={setUser} />
            <div className="content">
                <form onSubmit={mostrar}>
                    <h3>Seleccione la fecha que desea</h3>
                    <input 
                        type="date"
                        id="fecha"
                        name="dia"
                        value={fecha.dia}
                        onChange={inputChange}
                        required
                    />
                    <button 
                        className="btn btn-danger" 
                        type="submit">
                        <FaRegFilePdf /> Generar
                    </button>
                    {
                        errorFecha &&
                        <div className="alert alert-danger">
                            Error... no hay datos registrados para está fecha
                        </div>
                    }
                </form>
            </div>
        </div>
    )
}

export default Bitacora