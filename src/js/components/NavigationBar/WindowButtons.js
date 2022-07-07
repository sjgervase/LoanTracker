import React, { useState, useEffect, useRef, useContext, createContext } from 'react';

import { 
     FaWindowClose, 
     FaWindowMaximize,
     FaWindowMinimize,
     FaWindowRestore
} from "react-icons/fa";

import { ipcRenderer } from 'electron';





const {remote}  = require('electron');


export default function WindowButtons() {

     // close app
     const closeButtonClick = () => {
          ipcRenderer.send('closeApp')
     }


     // minimize
     const minimizeButtonClick = () => {
          ipcRenderer.send('minimizeApp')
     }

     const maximizeRestoreClick = () => {
          ipcRenderer.send('maximizeRestoreApp');
     }




     return (
          <div className='windowButtonsContainer'>

               <FaWindowMinimize className='windowButtonIcon minimizeButton' onClick={() => minimizeButtonClick()}/>

               
               <FaWindowMaximize className='windowButtonIcon minimizeMaximizeButton' onClick={() => maximizeRestoreClick()}/>
               {/* <FaWindowRestore className='windowButtonIcon minimizeMaximizeButton' onClick={() => maximizeRestoreClick()}/> */}

               

               <FaWindowClose className='windowButtonIcon closeButton' onClick={() => closeButtonClick()}/>


          </div>
     )
}