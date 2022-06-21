import React from "react";

// import from react-redux
import { useSelector } from "react-redux";

// import components
import ActiveLoanItem from "../ListMaps/ActiveLoanItem"

export default function ActiveLoanList(props) {

     // get data from redux store
     // only loans are needed
     const loansState = useSelector((state) => state.loans);


     // function to generate an array of loans that have not been designated as "paid off" and sorted by interest rate
     function activeLoansFunction() {
          // create an empty array
          let activeLoans = [];

          // default data is an empty array
          if (loansState.loans.length > 0) {
               // for each loan
               for (let i = 0; i < loansState.loans.length; i++) {
                    // if the loan has not been marked as paid off
                    if (!(loansState.loans[i].loan.PaidOff)) {
                         // push to array
                         activeLoans.push(loansState.loans[i].loan);
                    }
               }
          }

          // sort by interestRate
          activeLoans.sort((first, second) => {
               return first.InterestRate < second.InterestRate ? -1 : 1;
          });

          return activeLoans;
     }
     // generate array of active loans
     const activeLoans = activeLoansFunction();

     return(
          <>
               {activeLoans.map(loan =>
                    
                    <ActiveLoanItem
                    key={loan.GUID}
                    loan={loan}
                    parent={props.parent}
                    />
               
               )}
          </>
     );
}