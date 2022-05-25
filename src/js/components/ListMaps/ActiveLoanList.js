import React from "react";


// import components
import ActiveLoanItem from "../ListMaps/ActiveLoanItem"

export default function ActiveLoanList(props) {

     let loans;

     console.log(props);

     // for each element, remove if paid off
     if (props.loans) {
          // create a deep copy of the item 
          loans = JSON.parse(JSON.stringify(props.loans));

          for (let i = 0; i < loans.length; i++) {
               // if paid off
               if (loans[i].loan.PaidOff) {
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
                    
                    <ActiveLoanItem
                    key={loan.loan.GUID}
                    loan={loan.loan}
                    parent={props.parent}
                    />
               
               )}
          </>
     );
}