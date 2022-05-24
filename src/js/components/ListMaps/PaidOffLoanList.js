import React from "react";


// import components
import PaidOffLoanItem from "./PaidOffLoanItem"

export default function PaidOffLoanList(props) {

     let loans;
     
     // for each element, remove if paid off
     if (props.loans) {

          // create a deep copy of the item 
          loans = JSON.parse(JSON.stringify(props.loans));

          for (let i = 0; i < loans.length; i++) {
               // if paid off
               if (!loans[i].loan.PaidOff) {
                    // remove it
                   loans.splice(i, 1)
               }
          }
     }

     return(               
          <>
               {/* Sort by interest rate of the loan THEN map. */}

               {loans?.sort((first, second) => {
                    return first.InterestRate < second.InterestRate ? -1 : 1;
               }).map(loan =>

                    <PaidOffLoanItem
                    key={loan.loan.GUID}
                    loan={loan.loan}
                    />
               )}
          </>
     );
}