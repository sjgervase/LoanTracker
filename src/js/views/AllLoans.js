import React from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

import { BigNumber } from "bignumber.js"

// import components
import ActiveLoanList from "../components/ListMaps/ActiveLoanList";
import PaidOffLoanList from "../components/ListMaps/PaidOffLoanList";

export default function AllLoans(props) {

     // get data from redux store
     // only loans are needed
     const data = useSelector((state) => state.data[0]);

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     // function for total loan amount
     function totalLoanAmount() {
          // create big number equal to 0 to keep track of running total
          let runningTotal = new BigNumber(0);
          
          // for each loan
          for (let i = 0; i < data?.loans.length; i++) {

               // if the loan has not been paid off
               if (!(data?.loans[i].loan.PaidOff)) {
                    // get the Calculated Remaining Amount of that loan
                    let currentAmount = new BigNumber(data.loans[i].loan.CalculatedRemainingAmount);
                    // add the amount to running total
                    runningTotal = runningTotal.plus(currentAmount);
               }
          }
          return runningTotal.toFixed(2)
     }

     return(
          <div className="componentContainer">
               <h1 className="componentTitle">All Loans</h1>

               <h1 className="display-4">Total Loans Amount: {moneyFormatter(totalLoanAmount())}</h1>

               <div className="activeLoansAllLoans dashboardModule">
                         <div className="moduleHeader"><span>ACTIVE LOANS</span></div>
                         
                         <ActiveLoanList parent={"AllLoans"}/>
               </div>

               <div className="paidOffLoansAllLoans dashboardModule">
                         <div className="moduleHeader"><span>PAID OFF LOANS</span></div>
                         
                         <PaidOffLoanList loans={props.loans}/>
               </div>
          </div>
     )
}