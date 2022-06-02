import React from "react";

// import from react-redux
import { useSelector } from "react-redux";

// import components
import ActiveLoanItem from "../ListMaps/ActiveLoanItem"

export default function ActiveLoanList(props) {

     // get data from redux store
     const {data} = useSelector((state) => state);


     // function to generate an array of loans that have not been designated as "paid off" and sorted by interest rate
     function activeLoansFunction() {
          // create an empty array
          let activeLoans = [];

          // default data is an empty array
          if (data.length > 0) {
               // for each loan
               for (let i = 0; i < data[0].loans.length; i++) {
                    // if the loan has not been marked as paid off
                    if (!(data[0].loans[i].loan.PaidOff)) {
                         // push to array
                         activeLoans.push(data[0].loans[i].loan);
                    }
               }
          }
          
          // sort by interestRate
          activeLoans.sort((first, second) => {
               return first.InterestRate < second.InterestRate ? -1 : 1;
          });

          return activeLoans;
     }

     // run above function
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