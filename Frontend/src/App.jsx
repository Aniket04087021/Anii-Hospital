import React, { useContext, useEffect } from 'react'
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import AboutUs from './pages/AboutUs';
import Register from './pages/register';
import Login from './pages/login';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import { Context } from './main';

const App = () => {
  const{isAuthenticated} = useContext(Context);
  useEffect(()=>{
    
  })
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/appointment' element={<Appointment/>}/>
          <Route path='/about' element={<AboutUs/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/admin/login' element={<AdminLogin/>}/>
          <Route path='/admin' element={<AdminDashboard/>}/>
        </Routes>
        <ToastContainer position='top-center'/>
      </Router>
    </>
  )
}

export default App
