import React from "react";

// import from react-redux
import { useSelector } from "react-redux";

// import components
import PaidOffLoanItem from "./PaidOffLoanItem"

export default function PaidOffLoanList(props) {

     // get data from redux store
     // only loans are needed
     const loansState = useSelector((state) => state.loans);

     // function to generate an array of loans that have been designated as "paid off"
     function paidOffLoansFunction() {
          // create an empty array
          let paidOffLoans = [];

          // default data is an empty array
          if (loansState.loans.length > 0) {
               // for each loan
               for (let i = 0; i < loansState.loans.length; i++) {
                    // if the loan has not been marked as paid off
                    if (loansState.loans[i].loan.PaidOff) {
                         // push to array
                         paidOffLoans.push(loansState.loans[i].loan);
                    }
               }
          }
          
          return paidOffLoans;
     }

     // run above function
     const paidOffLoans = paidOffLoansFunction();



     return(
          <>
               {paidOffLoans.map(loan =>
                    
                    <PaidOffLoanItem
                    key={loan.GUID}
                    loan={loan}
                    parent={props.parent}
                    />
               
               )}
          </>
     );
}