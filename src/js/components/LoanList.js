import React, { useState } from "react";

// import from react router dom
import { useNavigate } from "react-router-dom";

// import from react bootstrap
import { Button } from "react-bootstrap";

// import components
import LoanItem from "./LoanItem"

export default function LoanList(props) {

     const navigate = useNavigate();

     // console.log(props);

     // open the loan page on the click of the below conditional button
     function addALoanShortcut() {
          navigate('/addaloan')
     }

     // {/* run function, which returns a button if no loans are currently saved */}
     // {loans && loans.length > 0 ? null : <Button variant="success" className="addALoanShortcutButton" onClick={() => addALoanShortcut()}>Add a loan</Button>}




     let loans = props.loans;

     return(               
          <div className="loanList">

               {/* Sort by interest rate of the loan THEN map. */}

               {loans?.sort((first, second) => {
                    return first.InterestRate < second.InterestRate ? -1 : 1;
               }).map(loan =>
                    
                    <LoanItem
                    key={loan.loan.GUID}
                    loan={loan.loan}
                    />
               
               )}
               

               

          </div>
     );
}