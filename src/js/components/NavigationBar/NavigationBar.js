import React from "react";

// ipc from electron
import { ipcRenderer } from "electron";

// import from react bootstrap
import { Navbar, Nav, Button } from 'react-bootstrap';



export default function NavigationBar() {

     // send to ipcMain to close app
     function closeApp() {
          ipcRenderer.send('closeApp');
     }

     // send to ipcMain to maximize or restore app
     function maximizeOrRestoreApp() {
          ipcRenderer.send('maximizeRestoreApp');
     }

     // send to ipcMain to minimize or restore app
     function minimizeApp() {
          ipcRenderer.send('minimizeApp');
     }


     return(

          <Navbar sticky="top" className="navbar-custom" variant="dark">
     
               <Navbar.Brand>Loan Tracker</Navbar.Brand>

               <Nav>
     
                    <Nav.Link href="#/">DashBoard</Nav.Link>
     
                    <Nav.Link href="#/addaloan">Add A Loan</Nav.Link>
                    
                    <Nav.Link href="#/allloans">All Loans</Nav.Link>

                    <Nav.Link href="#/simplebudget">Simple Budget</Nav.Link>

                    <Nav.Link href="#/settings">Settings</Nav.Link>
     
                    <div className="navbarDraggable"></div>

                    <div className="windowButtons">
                         <Button className="btn-custom shadow-none" onClick={minimizeApp}>
                              <svg className="navbarIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                   <path fill="currentColor" d="M0 448C0 430.3 14.33 416 32 416H480C497.7 416 512 430.3 512 448C512 465.7 497.7 480 480 480H32C14.33 480 0 465.7 0 448z"/>
                              </svg>
                         </Button>
                         
                         <Button className="btn-custom shadow-none" onClick={maximizeOrRestoreApp}>
                              <svg className="navbarIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                   <path fill="currentColor" d="M448 32C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H448zM96 96C78.33 96 64 110.3 64 128C64 145.7 78.33 160 96 160H416C433.7 160 448 145.7 448 128C448 110.3 433.7 96 416 96H96z"/>
                              </svg>
                         </Button>
                         
                         <Button className="btn-custom shadow-none" onClick={closeApp}>
                              <svg className="navbarIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                   <path fill="currentColor" d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/>
                              </svg>
                         </Button>
                    </div>

               </Nav>

          </Navbar>
         


     );
}
