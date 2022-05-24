import React from "react";

import { BigNumber } from "bignumber.js"

// import components
import ActiveLoanList from "../components/ListMaps/ActiveLoanList";
import PaidOffLoanList from "../components/ListMaps/PaidOffLoanList";

export default function AllLoans(props) {

     // function for total loan amount
     function totalLoanAmount() {
          let runningTotal = new BigNumber(0);
          
          for (let i = 0; i < props.data?.data.length; i++) {
               let currentAmount = new BigNumber(props.data.data[i].loan.CalculatedLoanAmount);

               runningTotal = runningTotal.plus(currentAmount);
          }

          return runningTotal.toFixed(2)
     }

     return(
          <div className="componentContainer">
               <h1 className="componentTitle">All Loans</h1>

               <h1 className="display-4">Total Loan Amount: {"$" + new Intl.NumberFormat().format(totalLoanAmount())}</h1>

               <div className="activeLoansAllLoans dashboardModule">
                         <div className="moduleHeader"><span>ACTIVE LOANS</span></div>
                         
                         <ActiveLoanList loans={props.data?.data} parent={"AllLoans"}/>
               </div>

               <div className="paidOffLoansAllLoans dashboardModule">
                         <div className="moduleHeader"><span>PAID OFF LOANS</span></div>
                         
                         <PaidOffLoanList loans={props.data?.data}/>
               </div>
          </div>
     )
}