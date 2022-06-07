import React from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

import { BigNumber } from "bignumber.js"

// import components
import ActiveLoanList from "../components/ListMaps/ActiveLoanList";
import PaidOffLoanList from "../components/ListMaps/PaidOffLoanList";

export default function AllLoans() {

     // get data from redux store
     // only loans are needed
     const loansState = useSelector((state) => state.loans);

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     // function for total loan amount
     function totalLoanAmount() {
          // create big number equal to 0 to keep track of running total
          let runningTotal = new BigNumber(0);
          
          // for each loan
          for (let i = 0; i < loansState.loans.length; i++) {

               // if the loan has not been paid off
               if (!(loansState.loans[i].loan.PaidOff)) {
                    // get the Calculated Remaining Amount of that loan
                    let currentAmount = new BigNumber(loansState.loans[i].loan.CalculatedRemainingAmount);
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

                    <div className="loanListContainer">
                         <ActiveLoanList parent={"AllLoans"}/>
                    </div>
               </div>

               <div className="paidOffLoansAllLoans dashboardModule">
                    <div className="moduleHeader"><span>PAID OFF LOANS</span></div>

                    <div className="loanListContainer">
                         <PaidOffLoanList />
                    </div>
               </div>
          </div>
     )
}