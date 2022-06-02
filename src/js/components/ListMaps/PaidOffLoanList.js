import React from "react";

// import from react-redux
import { useSelector } from "react-redux";

// import components
import PaidOffLoanItem from "./PaidOffLoanItem"

export default function PaidOffLoanList(props) {

     // get data from redux store
     const {data} = useSelector((state) => state);

     // function to generate an array of loans that have been designated as "paid off"
     function paidOffLoansFunction() {
          // create an empty array
          let paidOffLoans = [];

          // default data is an empty array
          if (data.length > 0) {
               // for each loan
               for (let i = 0; i < data[0].loans.length; i++) {
                    // if the loan has not been marked as paid off
                    if (data[0].loans[i].loan.PaidOff) {
                         // push to array
                         paidOffLoans.push(data[0].loans[i].loan);
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