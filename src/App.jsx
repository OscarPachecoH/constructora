import React, {useState} from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './Components/ProtectedRouter';
import Login from './Pages/Login';
import Perfil from './Pages/Perfil'
import Dashboard from './Pages/Dashboard';
import Materiales from './Pages/Material';
import Gastos from './Pages/Gastos';
import Lista from './Pages/ListaProyectos'
import Graficas from './Pages/Graficas'
import Bitacora from './Pages/Bitacora'

function App() {

  const [user, setUser] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login setUser={setUser}/>}/>
        <Route path='/login' element={<Login setUser={setUser}/>}/>
        <Route path='/dashboard' element={
          <ProtectedRoute user={user}>
            <Lista user={user} setUser={setUser}/>
          </ProtectedRoute>
        }/>
        <Route path='/dashboard/:id/:idObra' element={
          <ProtectedRoute user={user}>
            <Dashboard user={user} setUser={setUser}/>
          </ProtectedRoute>
        }/>
        <Route path='/perfil' element={
        <ProtectedRoute user={user}>
          <Perfil user={user} setUser={setUser}/>
        </ProtectedRoute>
        }/>
        <Route path='/dashboard/:id/materiales' element={
          <ProtectedRoute user={user}>
            <Materiales user={user} setUser={setUser}/>
          </ProtectedRoute>
        }/>
        <Route path='/dashboard/:id/gastos' element={
          <ProtectedRoute user={user}>
            <Gastos user={user} setUser={setUser}/>
          </ProtectedRoute>
        }/>
        <Route path='/dashboard/:id/graficas' element={
          <ProtectedRoute user={user}>
            <Graficas user={user} setUser={setUser}/>
          </ProtectedRoute>
        }/>
        <Route path='/dashboard/:id/bitacora' element={
          <ProtectedRoute user={user}>
            <Bitacora user={user} setUser={setUser}/>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;