import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import axios from "axios";
import { jsPDF } from "jspdf"
import Logo from '../Images/logo.jpg'
import Fondo from '../Images/fondoPDF.jpg'
import { FaRegFilePdf } from "react-icons/fa6";
import '../css/gastos.css'

const Gastos = ({user, setUser}) => {

    const [gastosMateriales, setGastosMateriales] = useState([])
    const [gastosTramites, setGastosTramites] = useState([])
    const [gastosMaquinaria, setGastosMaquinaria] = useState([])
    const [gastosAdicionales, setGastosAdicionales] = useState([])
    const [datosObra, setDatosObra] = useState([])

    useEffect(() => {
        getGastosMateriales()
        getGastosTramites()
        getGastosMaquinaria()
        getGastosAdicionales()
        getDastosGeneralesObra()
    }, [])

    const getGastosMateriales = async () => {
        try{
            const response = await axios.get('http://localhost:9000/gastos/materiales/' + user.idObra)
            if(response.data <= 1){
                alert("Todavia no hay resgistro")
            }
            setGastosMateriales(response.data)
        }catch (error){
            alert("algo paso")
        }
    }

    const getGastosTramites = async () => {
        try{
            const response = await axios.get('http://localhost:9000/gastos/tramites/' + user.idObra)
            setGastosTramites(response.data)
        }catch(error){
            alert("Algo paso")
        }
    }

    const getGastosMaquinaria = async () => {
        try{
            const response = await axios.get('http://localhost:9000/gastos/maquinaria/' + user.idObra)
            setGastosMaquinaria(response.data)
        }catch(error){
            alert('Algo paso')
        }
    }

    const getGastosAdicionales = async () => {
        try{
            const response = await axios.get('http://localhost:9000/gastos/adicionales/' + user.idObra)
            setGastosAdicionales(response.data)
        }catch(error){
            alert('Algo paso')
        }
    }

    const getDastosGeneralesObra = async () => {
        const response = await axios.get('http://localhost:9000/obra/datosgenerales/' + user.idObra)
        setDatosObra(response.data)
    }

    function totalGastosMateriales(){
        var t = 0
        gastosMateriales.map(function (x){
            t += (x.cantEntMat) * (x.precioUni)
        })
        return t;
    }

    function totalGastosTramites(){
        var t = 0
        gastosTramites.map(function (x){
            t += x.total
        })
        return t;
    }

    function totalGastosMaquinaria(){
        var t = 0
        gastosMaquinaria.map(function (x){
            t += x.total
        })
        return t;
    }

    function totalGastosAdicionales(){
        var t = 0
        gastosAdicionales.map(function (x){
            t += x.total
        })
        return t;
    }

    function number(x){
        return Number.parseFloat(x).toFixed(2)
    }

    const generarPDF = () => {
        const doc = new jsPDF({format:"letter"});

        const nombreCliente = user.nombreCliente + " " + user.apellidoPCliente + " " + user.apellidoMCliente;
        const repreLegal = "ING. ROSALIO SUASTEGUI MOLINA";
        const repreObra = datosObra.residente;
        const nombreObra = datosObra.nombreObra;
        const ubicacionObra = datosObra.direccionObra;

        const columns = ["No.", "Concepto", "Total"]
        const data = [
            [1,"Gastos Materiales", "$" + number(totalGastosMateriales())],
            [2,"Gastos Materiales", "$" + number(totalGastosTramites())],
            [3,"Gastos Materiales", "$" + number(totalGastosMaquinaria())],
            [4,"Gastos Materiales", "$" + number(totalGastosAdicionales())],
            ["","Total:","$" + number(totalGastosMateriales() + totalGastosTramites() + totalGastosMaquinaria() + totalGastosAdicionales())]
        ]

        const data2 = [
            ["ELABORO:", "Vo. Bo.",""],
            ["ROSMO COIN S.A. DE C.V.", "", ""],
            ["_______________________","_______________________","________________________"],
            [repreLegal, repreObra.toUpperCase(), nombreCliente.toUpperCase()],
            ["REPRESENTANTE LEGAL", "REPRESENTANTE DE OBRA", "DUEÑO DE OBRA"]
        ]

        //fondo de pagina
        doc.addImage(Fondo, "JPEG", 0, 50, 200, 200);
        doc.setFontSize(20);

        //titulo
        doc.setTextColor(19,43,76)
        doc.setFont("times", "bold")
        doc.text("Gastos de obra", 70, 20);

        doc.setLineWidth(1.5);
        doc.line(10, 23, 200, 23);

        //logo de empresa
        doc.addImage(Logo, "JPEG", 14, 24, 25, 25);
        doc.setFontSize(15);

        //datos de obra
        doc.text("Obra: ", 45, 30);
        doc.text(nombreObra, 60, 30);
        doc.text("Ubicación: ", 45, 35);
        doc.text(ubicacionObra, 70, 35);
        doc.text("Ciudad: Chilpancingo", 45, 40);
        doc.text("Estado: Guerrero", 45, 45);
        doc.setFontSize(10);
        doc.text("Fecha: ", 165, 45);
        doc.text(fecha(), 180, 45);

        doc.setLineWidth(1);
        doc.line(10, 50, 200, 50);

        //tabla de datos
        doc.autoTable({
            theme: 'plain',
            styles: {
                
                font: 'times',
                fontSize: 12
            },
            startY: 55,
            head: [columns],
            body: data
        });

        doc.setDrawColor(19,43,76);

        doc.setLineWidth(1);
        
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
        
        doc.output('dataurlnewwindow',{
            filename: 'gastos de obra'
        })
    }

    function fecha(){
        const date = new Date();

        const dia = date.getDate()
        const mes = date.getMonth()
        const anio = date.getFullYear()
        
        const fecha = dia + "/" + (mes + 1) + "/" + anio

        return fecha
    }
    
    return(
        <div>
            <Dashboard user={user} setUser={setUser}/>
            <div className="tabla">
                <table className="table table-bordered border-primary">
                    <thead className="table-primary">
                        <tr>
                            <th className="titulo-tabla" colspan="5"><h4>Gastos de obra</h4></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>#</th>
                            <th>Concepto</th>
                            <th width={150}>Total</th>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Gastos Materiales</td>
                            <td>$ {number(totalGastosMateriales())}</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Gastos Tramites</td>
                            <td>$ {number(totalGastosTramites())}</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Gastos Maquinaria</td>
                            <td>$ {number(totalGastosMaquinaria())}</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>Gastos Adicionales</td>
                            <td>$ {number(totalGastosAdicionales())}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th className="titulo-total" colSpan={2}>Total:</th>
                            <th>${number(totalGastosMateriales() + totalGastosTramites() + totalGastosMaquinaria() +totalGastosAdicionales())}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="botones-accion">
                <button className="btn btn-danger" onClick={generarPDF}><span><FaRegFilePdf/> Generar</span></button>
            </div>
        </div>
    )
}

export default Gastos