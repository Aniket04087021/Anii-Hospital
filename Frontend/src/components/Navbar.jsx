import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {Context} from "../main"

const Navbar = () => {
    const [show , setShow] = useState(false);
    const {isAuthenticated} = useContext(Context);

    const navigateTo = useNavigate()

    const handleLogout = async()=>{
        try{
            await axios.get("",{withCredentials: true})
        } catch (error){
            
        }
    }
    const gotoLogin =() =>{
      navigateTo("/login");
    };
  return (
    
      <nav className='container'>
        <div className="logo">AniiCare</div>
        <div className={show ? 'navLinks showmenu': 'navLinks'}>
        <div className="links">
            <Link to={"/"}>Home</Link>
            <Link to={"/appointment"}>APPOINTMENT</Link>
            <Link to={"/about"}>ABOUT US</Link>
            
        </div>
        {isAuthenticated ? (
            <button className='logoutBtn btn' onClick={handleLogout}>LOGOUT</button>):(<button className='logoutBtn btn' onClick={gotoLogin}>LOGIN</button>)}
        </div>
      </nav>
    
  )
}

export default Navbar
