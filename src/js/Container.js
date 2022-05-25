import React, { useState, useEffect, useRef } from 'react';

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import from store actions
import { fetchData } from "./actions/data"

// for from react-router-dom
import {
     HashRouter as Router,
     Routes,
     Route
} from "react-router-dom"



// import views
import DashBoard from "./views/DashBoard";
import Settings from "./views/Settings"
import SimpleBudget from "./views/SimpleBudget";
import AllLoans from "./views/AllLoans";
import AddALoan from './views/AddALoan';
import LoanItemView from './views/LoanItemView';

// import navbar
import NavigationBar from "./components/NavigationBar/NavigationBar";

export default function Container() {

     // for stored loan data

     // all data
     const data = useSelector(({data}) => data.items);

     const dispatch = useDispatch();


     // fetch data on load
     useEffect(() => {
          dispatch(fetchData());

          // // then every 3 seconds
          // setInterval(() => {
          //      console.log("fetching");
          //      dispatch(fetchData());
          // }, 2000)

     }, [dispatch]);


     // if data exists, calculate remaining loan balance by subtracting payments and adding late fees.
     if (data !== undefined) {

          // for each loan item
          for (let i = 0; i < data.data[0].loans?.length; i++) {              
               
               let calculatedAmount = parseFloat(data.data[0].loans[i].loan.TotalLoanAmount);

               // for each payment in PaymentHistory
               for (let j = 0; j < data.data[0].loans[i].loan.PaymentHistory.length; j++) {
                    calculatedAmount -= parseFloat(data.data[0].loans[i].loan.PaymentHistory[j].amount);
               }

               // for each late fee in LateFees
               for (let j = 0; j < data.data[0].loans[i].loan.LateFees.length; j++) {
                    calculatedAmount += parseFloat(data.data[0].loans[i].loan.LateFees[j].amount);
               }

               data.data[0].loans[i].loan.CalculatedLoanAmount = calculatedAmount.toFixed(2);
               
               // add additional prop to loan if its calculated amount is less than or equal to 0
               if (calculatedAmount <= 0) {
                    data.data[0].loans[i].loan.PaidOff = true;

                    
               } else {
                    data.data[0].loans[i].loan.PaidOff = false;
               }
          }
     }


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
                                   <SimpleBudget 
                                   loans={data?.data[0].loans}
                                   bills={data?.data[1].bills}
                                   incomes={data?.data[2].incomes}
                                   />
                              }/>

                              <Route
                              path="/allloans"
                              element={
                                   <AllLoans
                                   loans={data?.data[0].loans}/>
                              }/>
                              
                              <Route path="/addaloan" element={<AddALoan/>}/>

                              {/* dynamic view for closer look at an individual loan */}
                              <Route
                              path="/loanitemview"
                              element={
                                   <LoanItemView
                                   loans={data?.data[0].loans}/>
                              }/>

                              <Route
                              path="/"
                              element={
                                   <DashBoard
                                   loans={data?.data[0].loans}/>
                              }/>
                              
                         </Routes>
                    </div>
               </div>

          </Router>
          
     );
}