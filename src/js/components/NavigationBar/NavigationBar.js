import React from "react";

// ipc from electron
import { ipcRenderer } from "electron";

// import from react bootstrap
import { Navbar, Nav, Button } from 'react-bootstrap';

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import from react router dom
import { useNavigate } from "react-router-dom";

// icons from react-icons
import { AiFillCar, AiFillHome } from "react-icons/ai"; 
import { FaGraduationCap, FaUser, FaCreditCard, FaClipboardList } from "react-icons/fa";

import Icon from "../../../../assets/images/LoanTrackerIconSmall.png";
import { useLocation } from "react-router-dom";

export default function NavigationBar() {

     // get data from redux store
     // only loans are needed
     const loansState = useSelector((state) => state.loans);

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


     const overviewIcon = (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
               <path fill="currentColor" d="M575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6H511.8L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5L575.8 255.5z"/>
          </svg>
     );

     const addALoanIcon = (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
               <path fill="currentColor" d="M0 64C0 28.65 28.65 0 64 0H224V128C224 145.7 238.3 160 256 160H384V198.6C310.1 219.5 256 287.4 256 368C256 427.1 285.1 479.3 329.7 511.3C326.6 511.7 323.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM256 128V0L384 128H256zM288 368C288 288.5 352.5 224 432 224C511.5 224 576 288.5 576 368C576 447.5 511.5 512 432 512C352.5 512 288 447.5 288 368zM448 303.1C448 295.2 440.8 287.1 432 287.1C423.2 287.1 416 295.2 416 303.1V351.1H368C359.2 351.1 352 359.2 352 367.1C352 376.8 359.2 383.1 368 383.1H416V431.1C416 440.8 423.2 447.1 432 447.1C440.8 447.1 448 440.8 448 431.1V383.1H496C504.8 383.1 512 376.8 512 367.1C512 359.2 504.8 351.1 496 351.1H448V303.1z"/>
          </svg>
     );

     const allLoansIcon = (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
               <path fill="currentColor" d="M88 48C101.3 48 112 58.75 112 72V120C112 133.3 101.3 144 88 144H40C26.75 144 16 133.3 16 120V72C16 58.75 26.75 48 40 48H88zM480 64C497.7 64 512 78.33 512 96C512 113.7 497.7 128 480 128H192C174.3 128 160 113.7 160 96C160 78.33 174.3 64 192 64H480zM480 224C497.7 224 512 238.3 512 256C512 273.7 497.7 288 480 288H192C174.3 288 160 273.7 160 256C160 238.3 174.3 224 192 224H480zM480 384C497.7 384 512 398.3 512 416C512 433.7 497.7 448 480 448H192C174.3 448 160 433.7 160 416C160 398.3 174.3 384 192 384H480zM16 232C16 218.7 26.75 208 40 208H88C101.3 208 112 218.7 112 232V280C112 293.3 101.3 304 88 304H40C26.75 304 16 293.3 16 280V232zM88 368C101.3 368 112 378.7 112 392V440C112 453.3 101.3 464 88 464H40C26.75 464 16 453.3 16 440V392C16 378.7 26.75 368 40 368H88z"/>
          </svg>
     );

     const allLoansChevron = (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
               <path fill="currentColor" d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"/>
          </svg>
     );

     const simpleBudgetIcon = (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
               <path fill="currentColor" d="M304 16.58C304 7.555 310.1 0 320 0C443.7 0 544 100.3 544 224C544 233 536.4 240 527.4 240H304V16.58zM32 272C32 150.7 122.1 50.34 238.1 34.25C248.2 32.99 256 40.36 256 49.61V288L412.5 444.5C419.2 451.2 418.7 462.2 411 467.7C371.8 495.6 323.8 512 272 512C139.5 512 32 404.6 32 272zM558.4 288C567.6 288 575 295.8 573.8 305C566.1 360.9 539.1 410.6 499.9 447.3C493.9 452.1 484.5 452.5 478.7 446.7L320 288H558.4z"/>
          </svg>
     );

     const settingsIcon = (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
               <path fill="currentColor" d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"/>
          </svg>
     );

     // get the current location to more accurately show the active nav tab
     const location = useLocation();

     // navigate functionality for loans dropdown 
     let navigate = useNavigate();

     // functionality for more info button
     // pass the guid of the selected loan
     function loanItemView(GUID) {
          // console.log(seeThisLoan);
          navigate('/loanitemview', {state:GUID});
          
     }

     // returns the icon relating to whichever loan category was selected for dropdown
     function loanTypeIcon(loanCategory) {
          switch (loanCategory) {
               case 'StudentLoan':
               return(<FaGraduationCap/>);     
               
               case 'Mortgage':
               return(<AiFillHome/>);     

               case 'VehicleLoan':
               return(<AiFillCar/>);

               case 'PersonalLoan':
               return(<FaUser/>);

               case 'CreditCard':
               return(<FaCreditCard/>);
          }
     }


     return(
          
          <Nav defaultActiveKey="/" className="flex-column navigationBar">

               <Nav.Item className="navItemLogo">
                    <img src={Icon} className="navLogo"/>
                    Loan Tracker
               </Nav.Item>

               <Nav.Item className={`navItem ${location.pathname === "/" ? "activeNavItem" : ""}`}>
                    <Nav.Link href="#/" className="navLink">
                         <div className="navIcon overviewNavIcon">{overviewIcon}</div>
                         <h6>Overview</h6>
                    </Nav.Link>
                    <div className="activNavIndicator"></div>
               </Nav.Item>

               
               <Nav.Item className={`navItem ${location.pathname === "/addaloan" ? "activeNavItem" : ""}`}>
                    <Nav.Link href="#/addaloan" className="navLink">
                         <div className="navIcon addALoanNavIcon">{addALoanIcon}</div>
                         <h6>Add A Loan</h6>
                    </Nav.Link>
                    <div className="activNavIndicator"></div>
               </Nav.Item>


               <div className={`allLoansDropDown ${location.pathname === "/loanitemview" || location.pathname === "/allloans" ? "activeLoanDropdown" : ""}`}>
                    <div className="allLoansDropDownHeader">
                         <div className="navIcon allLoansNavIcon">{allLoansIcon}</div>
                         <h6>Loans</h6>
                         <div className="navIcon allLoansNavIcon allLoansChevron">{allLoansChevron}</div>
                    </div>

                    <div className="allLoansDropDownList">

                    <Nav.Item className={`navItem ${location.pathname === "/allloans" ? "activeNavItem" : ""}`}>
                              <Nav.Link href="#/allloans" className="navLink">
                                   <div className="navIcon allLoansNavIcon"><FaClipboardList/></div>
                                   <h6 className="allLoansDropDownTitle">All Loans</h6>
                              </Nav.Link>
                              <div className="activNavIndicator"></div>
                         </Nav.Item>

                         {loansState.loans.map(loan => 

                         <Nav.Item key={loan.loan.GUID} className={`allLoansDropDownItem ${location.pathname === "/loanitemview" && location.state === loan.loan.GUID ? "activeNavItem" : ""}`} onClick={() => loanItemView(loan.loan.GUID)}>
                              <Nav.Link className="navLink">
                                   <div className="navIcon allLoansNavIcon">{loanTypeIcon(loan.loan.LoanCategory)}</div>
                                   <h6 className="allLoansDropDownTitle">{loan.loan.LoanName}</h6>
                              </Nav.Link>
                              <div className="activNavIndicator"></div>
                         </Nav.Item>
                         )}
                    </div>
               </div>

               
               <Nav.Item className={`navItem ${location.pathname === "/simplebudget" ? "activeNavItem" : ""}`}>
                    <Nav.Link href="#/simplebudget" className="navLink">
                         <div className="navIcon simpleBudgetNavIcon">{simpleBudgetIcon}</div>
                         <h6>Simple Budget</h6>
                    </Nav.Link>
                    <div className="activNavIndicator"></div>
               </Nav.Item>


               <Nav.Item className={`navItem ${location.pathname === "/settings" ? "activeNavItem" : ""}`}>
                    <Nav.Link href="#/settings" className="navLink">
                         <div className="navIcon settingsNavIcon">{settingsIcon}</div>
                         <h6>Settings</h6>
                    </Nav.Link>
                    <div className="activNavIndicator"></div>
               </Nav.Item>

               

          </Nav>

          // <Navbar sticky="top" className="navbar-custom" variant="dark">
     
          //      <Navbar.Brand className="navbarDraggable">
          //           <img src={Icon} className="navbarLogo"/>
          //           Loan Tracker
          //      </Navbar.Brand>

          //      <Nav>
          //           <Nav.Link href="#/">Overview</Nav.Link>
     
          //           <Nav.Link href="#/addaloan">Add A Loan</Nav.Link>
                    
          //           <Nav.Link href="#/allloans">All Loans</Nav.Link>

          //           <Nav.Link href="#/simplebudget">Simple Budget</Nav.Link>

          //           <Nav.Link href="#/settings">Settings</Nav.Link>
     
          //           <div className="navbarDraggable"></div>

          //           <div className="windowButtons">
          //                <Button className="btn-custom shadow-none" onClick={minimizeApp}>
          //                     <svg className="navbarIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          //                          <path fill="currentColor" d="M0 448C0 430.3 14.33 416 32 416h680C497.7 416 512 430.3 512 448C512 465.7 497.7 480 480 480H32C14.33 480 0 465.7 0 448z"/>
          //                     </svg>
          //                </Button>
                         
          //                <Button className="btn-custom shadow-none" onClick={maximizeOrRestoreApp}>
          //                     <svg className="navbarIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          //                          <path fill="currentColor" d="M448 32C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32h648zM96 96C78.33 96 64 110.3 64 128C64 145.7 78.33 160 96 160h616C433.7 160 448 145.7 448 128C448 110.3 433.7 96 416 96H96z"/>
          //                     </svg>
          //                </Button>
                         
          //                <Button className="btn-custom shadow-none" onClick={closeApp}>
          //                     <svg className="navbarIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          //                          <path fill="currentColor" d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/>
          //                     </svg>
          //                </Button>
          //           </div>
          //      </Nav>
          // </Navbar>
     );
}
