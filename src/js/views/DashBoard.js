import React, { useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Button } from "react-bootstrap";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import components
import ActiveLoanList from "../components/ListMaps/ActiveLoanList";
import LoansPieChart from "../components/Charts/LoansPieChart";
import RecentRecordedPayments from "../components/ListMaps/RecentRecordedPayments";


export default function DashBoard() {

     // get data from redux store
     // only loans are needed
     const loansState = useSelector((state) => state.loans);
     
     
     // navigate functionality
     let navigate = useNavigate();


     // functionality for if an end user has no loans. 
     function addALoan() {
          navigate('/addaloan');
     }


     // function to return a button to quickly add a loan if no loans are present in data
     function noData() {
          // if there are no loans in store array
          if (loansState.loans.length == 0) {
               // return a button that allows the end user to quickly add a loan
               return(
                    <div className="noLoansDiv">
                         <p>It looks like you don't have any loans yet. Click the button below to add your first one. Or, you can click on "Loans" in the top navigation bar and add a loan from there.</p>

                         <Button size="lg" variant="success" onClick={()=>addALoan()}>
                              Add Your First Loan
                         </Button>
                    </div>
               );
          }
     }


     return(
          <div className="componentContainer">
               <h1 className="componentTitle">DashBoard</h1>
               <div className="dashboardModules">
                    
                    <div className="activeLoans dashboardModule">
                         <div className="moduleHeader"><span>ACTIVE LOANS</span></div>
                         <div className="loanListContainer">
                              {/* if the end user has no loans */}
                              {noData()}
                              <ActiveLoanList parent={"DashBoard"}/>
                         </div>
                    </div>

                    <div className="activeLoansGraphs dashboardModule">
                         <div className="moduleHeader"><span>TOTAL LOANS</span></div>
                         <LoansPieChart/>
                    </div>

                    <div className="recentTrackedPayments dashboardModule">
                         <div className="moduleHeader"><span>RECENTLY RECORDED PAYMENTS</span></div>
                         <RecentRecordedPayments/>
                    </div>
               </div>
          </div>
     );
}