import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf"
import 'jspdf-autotable'
import '../css/materiales.css'
import Logo from '../Images/logo.jpg'
import Fondo from '../Images/fondoPDF.jpg'
import { FaRegFilePdf } from "react-icons/fa6";
import Dashboard from "./Dashboard";

const Materiales = ({user, setUser}) => {

    const [materiales, setMateriales] = useState([])
    const [datosObra, setDatosObra] = useState([])

    useEffect(() => {
        getMateriales()
        getResidente()
    }, [])

    const getMateriales = async () => {
        try{
            const response = await axios.get('http://localhost:9000/materiales/' + user.idObra)
            console.log(response.data);
            if(response.data <= 1){
                alert("Todavia no hay resgistro")
            }
            setMateriales(response.data)
        }catch (error){
            alert("algo paso")
        }
        
    }

    const getResidente = async () => {
        const response = await axios.get('http://localhost:9000/obra/residente/' + user.idObra)
        setDatosObra(response.data)
    }

    const generarPDF = () => {
        const doc = new jsPDF()

        const nombreCliente = user.nombreCliente + " " + user.apellidoPCliente + " " + user.apellidoMCliente;
        const repreObra = datosObra.residente

        const columns = ["No.", "Material", "Cantidad", "Precio Unidad", "Total"]
        const data = []

        for(let i = 0; i < materiales.length; i++){
            const dato = []
            dato.push((i + 1), materiales[i].nombreMaterial, materiales[i].cantEntMat, number(materiales[i].precioUni), number((materiales[i].cantEntMat * materiales[i].precioUni)))
            data.push(dato)
        }

        doc.addImage(Fondo, "JPEG", 0, 50, 200, 200);
        doc.setFontSize(20);
        doc.setTextColor(19,43,76)
        doc.setFont("times", "bold")
        doc.text("Control de Materiales", 70, 20);
        doc.setLineWidth(1.5);
        doc.line(10, 23, 200, 23);
        doc.addImage(Logo, "JPEG", 14, 24, 25, 25);
        doc.setFontSize(15);
        doc.text("Obra: ", 45, 30);
        doc.text("Ubicación: ", 45, 35);
        doc.text("Ciudad: Chilpancingo", 45, 40);
        doc.text("Estado: Guerro", 45, 45);
        doc.setFontSize(10);
        doc.text("Fecha: ", 165, 45);
        doc.text(fecha(), 180, 45)
        doc.setLineWidth(1);
        doc.line(10, 50, 200, 50);

        doc.autoTable({
            theme: 'plain',
            startY: 50,
            head: [columns],
            body: data
        })


        doc.setDrawColor(19,43,76);

        doc.setLineWidth(1);
        
        //lineas verticales
        doc.line(10, 250, 10, 285);
        doc.line(73, 250, 73, 285);
        doc.line(139, 250, 139, 285);
        doc.line(200, 250, 200, 285);
        
        //lineas horizontales
        doc.line(9, 250, 200, 250);
        doc.line(9, 284, 200, 284);
        
        //textos
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("ELABORÓ:", 30, 255)
        doc.text("ING. ROSALIO SUASTEGUI MOLINA",11, 276)
        
        doc.setLineWidth(0.5);
        doc.line(12, 271, 70, 271)
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("ROSMO COIN S.A. DE C.V.", 18, 260);
        doc.text("REPRESENTANTE LEGAL", 20, 280);
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Vo. Bo.:", 100, 255)
        doc.text(repreObra.toUpperCase(), 79, 276)
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("REPRESENTANTE DE OBRA", 83, 280);
        
        doc.setLineWidth(0.5);
        doc.line(76, 271, 135, 271)
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Vo. Bo.:", 100, 255)
        doc.text(nombreCliente.toUpperCase(), 146, 276)
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("DUEÑO DE OBRA", 155, 280);
        
        doc.setLineWidth(0.5);
        doc.line(142, 271, 196, 271)

        doc.output('dataurlnewwindow')

        // console.log(datosObra.residente)
        //doc.save('materiales.pdf')
        //console.log(fecha())
    }

    function fecha(){
        const date = new Date();

        const dia = date.getDate()
        const mes = date.getMonth()
        const anio = date.getFullYear()
        
        const fecha = dia + "/" + (mes + 1) + "/" + anio

        return fecha
    }

    function total(){
        var t = 0
        materiales.map(function (x){
            t += (x.cantEntMat) * (x.precioUni)
        })
        return t;
    }

    function number(x){
        return Number.parseFloat(x).toFixed(2)
    }

    return(
        <div>
            <Dashboard user={user} setUser={setUser}/>
            <table className="table">
                <thead>
                    <tr>
                        <th className="titulo-tabla" colspan="5"><h4>Materiales</h4></th>
                    </tr>
                </thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio por Unidad</th>
                    <th>Total</th>
                </tr>
                {materiales.map((mat) => (
                    <tr key={mat.idEntMat}>
                        <td>{mat.idEntMat}</td>
                        <td>{mat.nombreMaterial}</td>
                        <td>{mat.cantEntMat}</td>
                        <td>$ {number(mat.precioUni)}</td>
                        <td>$ {number((mat.cantEntMat) * (mat.precioUni))}</td>
                    </tr>
                ))
                }
                <tr>
                    <th className="titulo-total" colspan="4">Total:</th>
                    <th>$ {total()}</th>
                </tr>
            </table>
            <div className="botones-accion">
                <button className="btn btn-danger" onClick={generarPDF}><span><FaRegFilePdf/> Generar</span></button>
            </div>
        </div>
        
    )
}

export default Materiales