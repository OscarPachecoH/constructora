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

    const [data, setData] = useState({});

    useEffect(() => {
        getTotalPisos()
    }, [])

    const getTotalPisos = async () => {
        try{
            const response = await axios.get('https://constructora-api-test-production.up.railway.app/graficas/totalCantidadPiso/' + user.idObra)
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
                barPercentage: 1.2,
                data: Array.isArray(data) ? data.map((entry) => Math.round(entry.cantidadTotalAvanzado * 100 / entry.cantidadTotalFinal)) : [],
                backgroundColor: '#132b4c'
            }
        ]
    }

    return(
        <div>
            <Dashboard user={user} setUser={setUser}/>
            <div className="grafica">
                <Bar data={midata} options={misoptions}/>
            </div>
        </div>
    )
}

export default Graficas