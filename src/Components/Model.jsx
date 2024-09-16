import React from 'react'
import Footer from './Footer'

export default function Model() {
  return (
    <div>
      <div id="container3D"></div>
      <div id="container2D"></div>
      <div id="buttonContainer">
        <button id="prevButton" class="arrow-button">&#9664;</button>
        <button id="nextButton" class="arrow-button">&#9654;</button>
        <button id="upButton" class="arrow-button">&#9650;</button>
        <button id="downButton" class="arrow-button">&#9660;</button>
      </div>
      <Footer></Footer>
    </div>
  )
}
