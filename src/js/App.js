import React, { useState, useEffect, useRef, useContext, createContext } from 'react';


// Redux
// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import fetch from slices
import { fetchSettings } from './Redux/features/SettingsSlice';
import { fetchLoans } from './Redux/features/LoansSlice';
import { fetchIncomes } from './Redux/features/IncomesSlice';
import { fetchDeductions } from './Redux/features/DeductionsSlice';



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

     const dispatch = useDispatch();

     // SETTINGS SLICE
     // settings request status
     const settingsStatus = useSelector(state => state.settings.status);
     // get all settings from redux store
     const settingsState = useSelector((state) => state.settings);

     // fetch settings on load
     useEffect(() =>{
          // if idle
          if (settingsStatus === 'idle') {
               dispatch(fetchSettings())
          }
     }, [settingsStatus, dispatch])

     // get the current theme from the redux store
     const currentTheme = (settingsState.settings[0] ? settingsState.settings[0].UserSelectedTheme : null)
     
     // set current theme based on saved settings
     useEffect(() => {
          // if dark, remove dark
          if (currentTheme == 'dark') {
               document.body.classList.add("dark-green");
          } else {
               document.body.classList.remove("dark-green");
          }
     }, [currentTheme])



     

     // LOANS SLICE
     // loans request status
     const loansStatus = useSelector(state => state.loans.status);
     // get all loans from the redux store
     const loansState = useSelector(state => state.loans)

     // fetch loans on load
     useEffect(() =>{
          // if idle
          if (loansStatus === 'idle') {
               dispatch(fetchLoans())
          }
     }, [loansStatus, dispatch])




     // INCOMES SLICE
     // incomes request status
     const incomesStatus = useSelector(state => state.incomes.status);
     // get all loans from the redux store
     const incomesState = useSelector(state => state.incomes)

     // fetch loans on load
     useEffect(() =>{
          // if idle
          if (incomesStatus === 'idle') {
               dispatch(fetchIncomes())
          }
     }, [incomesStatus, dispatch])



     
     // DEDUCTIONS SLICE
     // deductions request status
     const deductionsStatus = useSelector(state => state.deductions.status);
     // get all loans from the redux store
     const deductionsState = useSelector(state => state.deductions)

     // fetch loans on load
     useEffect(() =>{
          // if idle
          if (deductionsStatus === 'idle') {
               dispatch(fetchDeductions())
          }
     }, [deductionsStatus, dispatch])






     // // to write to the file
     // useEffect(() => {
     //      let dataObject = {
     //           ...loansState,
     //           ...deductionsState,
     //           ...incomesState,
     //           ...settingsState
     //      }

     //      console.log(dataObject);

     // }, [settingsState, loansState, incomesState, deductionsState])




     
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