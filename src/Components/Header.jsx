import React from 'react'
import { Link } from "react-router-dom";
import Innovis_Logo from '../Images/Innovis_Logo.jpg'

export default function Header() {
  return (
    <div>
      <header>
        <div className="logo">
          {/* <img src="/images/Innovis_Logo.jpg" alt="Logo" /> */}
          <img src={Innovis_Logo} alt="Logo" />
        </div>
        <nav>
          <ul>
            <li><Link to={"/"}>Home</Link></li>
            <li><Link to="#">Pictures</Link></li>
            <li><Link to={"3D_model"}>3D View</Link></li>
            <li><Link to="#">List</Link></li>
          </ul>
        </nav>
      </header>
    </div>

  )
}
