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
import Loans from "./views/Loans";
import AddALoan from './views/AddALoan';
import LoanItemView from './views/LoanItemView';

// import navbar
import NavigationBar from "./components/NavigationBar";

export default function Container() {

     // for stored loan data

     // all data
     const data = useSelector(({data}) => data.items);

     const dispatch = useDispatch();


     // fetch data on load
     useEffect(() => {
          dispatch(fetchData());

          // then every 3 seconds
          // setInterval(() => {
          //      console.log("fetching");
          //      dispatch(fetchData());
          // }, 1000)

     }, [dispatch]);

     // console.log(data);


     return(

          <Router>
               <NavigationBar/>

               {/* The two viewContainer divs are used for aesthectic purposes */}
               <div className="viewsContainerParent">
                    <div className="viewsContainerChild">
                         <Routes>
                              <Route path="/settings" element={<Settings/>}/>
                              <Route path="/simplebudget" element={<SimpleBudget/>}/>
                              <Route path="/loans" element={<Loans/>}/>
                              <Route path="/addaloan" element={<AddALoan/>}/>

                              {/* dynamic view for closer look at an individual loan */}
                              <Route path="/loanitemview" element={<LoanItemView/>}></Route>

                              <Route path="/" element={<DashBoard data={data} />} />
                              
                         </Routes>
                    </div>
               </div>

          </Router>
          
     );
}