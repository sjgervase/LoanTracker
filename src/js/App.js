import React, { useState, useEffect, useRef, useContext, createContext } from 'react';


// Redux
// import from react-redux
import { useDispatch, useSelector } from "react-redux";
// import actions
import {
     requestData
} from './reduxStore/actions';




// for from react-router-dom
import {
     HashRouter as Router,
     Routes,
     Route
} from "react-router-dom"


// import bigNumber
import BigNumber from 'bignumber.js';


// import views
import DashBoard from "./views/DashBoard";
import Settings from "./views/Settings"
import SimpleBudget from "./views/SimpleBudget";
import AllLoans from "./views/AllLoans";
import AddALoan from './views/AddALoan';
import LoanItemView from './views/LoanItemView';

// import navbar
import NavigationBar from "./components/NavigationBar/NavigationBar";




export default function App() {

     // get dispatch
     const dispatch = useDispatch();

     // run action to fetch local data on load
     useEffect(() => {
          dispatch(requestData())
     },[])

     return(

          
               <Router>
               <NavigationBar />

                    {/* The two viewContainer divs are used for aesthectic purposes */}
                    <div className="viewsContainerParent">
                         <div className="viewsContainerChild">

                              <Routes>

                                   <Route path="/settings" element={<Settings/>}/>
                                   
                                   <Route 
                                   path="/simplebudget"
                                   element={
                                        <SimpleBudget />
                                   }/>

                                   <Route
                                   path="/allloans"
                                   element={
                                        <AllLoans/>
                                   }/>
                                   
                                   <Route
                                   path="/addaloan"
                                   element={
                                        <AddALoan/>
                                   }/>

                                   {/* dynamic view for closer look at an individual loan */}
                                   <Route
                                   path="/loanitemview"
                                   element={
                                        <LoanItemView/>
                                   }/>

                                   <Route
                                   path="/"
                                   element={
                                        <DashBoard/>
                                   }/>
                                   
                              </Routes>

                              
                         </div>
                    </div>

               </Router>

          
     )
}