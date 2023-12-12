import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"
import { Chart as Chartjs, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import Dashboard from "./Dashboard";
import "../css/graficas.css"
import axios from "axios";

Chartjs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Graficas = ({user, setUser}) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        getTotalPisos()
    }, [])

    var totalPisos = [];
    var porcentaje = [];

    const getTotalPisos = async () => {
        try{
            const response = await axios.get('http://localhost:9000/graficas/totalCantidadPiso/' + user.idObra)
            const jsonData = response.data
            setData(jsonData)
        }catch(error){
            console.log('algo ocurrio');
        }
    }

    var misoptions ={
        indexAxis: 'y',
        responsive: true,
        animation:true,
        plugins:{
            legend:{
                display: false
            }
        },
        scales:{
            y: {
                min: 0,
                max: 100
            },
            x: {
                ticks: {color: 'rbg(0,220,195)'}
            }
        }
    };
    
    var midata = {
        labels: Array.isArray(data) ? data.map((entry) => ('Piso ' + entry.piso)) : [],
        datasets :[
            {
                label : 'Porcentaje avanzado',
                data: Array.isArray(data) ? data.map((entry) => (entry.cantidadTotal * 100 / 240)) : [],
                backgroundColor: '#132b4c'
            }
        ]
    }

    return(
        <div>
            <Dashboard user={user} setUser={setUser}/>
            <div><Bar data={midata} options={misoptions}/></div>
        </div>
    )
}

export default Graficas