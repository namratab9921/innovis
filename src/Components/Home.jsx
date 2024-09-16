import React from 'react'
import sampleimage1 from '../Images/sampleimage1.png'
import sampleimage2 from '../Images/sampleimage2.png'

export default function Home() {



  return (
    <div>
      <div className="search-area searchbar">
        <input id="search-input" type="text" placeholder="Search by Name, location..." />
        <select id="site-type">
          <option value="">Choose Site Type</option>
          <option value="GBT">GBT (Ground Based Tower)</option>
          <option value="RTT">RTT (Roof Top Tower)</option>
          <option value="RI">RI (Roof Installation)</option>
        </select>
        <select id="category">
          <option value="">Choose Category</option>
          <option value="Platinum">Platinum</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
        </select>
        <select id="maint-status">
          <option value="">Choose Maint. Status</option>
          <option value="completed_last_month">Completed &lt; 1 Month Ago</option>
          <option value="completed_last_year">Completed &lt; 1 Year Ago</option>
        </select>
      </div>
      <div className="grid-container">
        <div className="list-container">
          <h1>Sites</h1>
          <ul id="site-list">
            {/* Sites will be dynamically inserted here */}
          </ul>
        </div>
        <div className="details-container">
          <div className="box" id="box1">
            <div className="info-area" id="site-info" />
          </div>
          <div className="box">
            <div className="carousel">
              <div className="carousel-inner">
                <img src={sampleimage1} alt="Image 1" />
                <img src={sampleimage2} alt="Image 2" />
                <img src={"/DJI_0336.JPG"} alt="Image 3" />
              </div>
              <button
                className="carousel-button left"
                onClick={() => this.moveCarousel(-1)}
              >
                ❮
              </button>
              <button
                className="carousel-button right"
                onClick={() => this.moveCarousel(1)}
              >
                ❯
              </button>
            </div>
          </div>
          <div className="box" id="box3">
            <div className="info-area" id="defect-info" />
          </div>
          <div className="box" id="box4">
            <div className="info-area" id="inventory-info" />
          </div>
          <div className="box" id="box5">
            {/* 3D object will be rendered here */}
          </div>
          <div className="box" id="box6">
            <div className="info-area" id="tower-measurement" />
          </div>
        </div>
      </div>
    </div>
  )
}
