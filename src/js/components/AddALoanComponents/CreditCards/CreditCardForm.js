import React from "react";

import { Alert } from "react-bootstrap";


// import form components
import CurrentPayment from "./CurrentPayment";
import GeneralLoanInfo from "../GeneralLoanInfo";
import OptionalLoanInfo from "../OptionalInfo";
import SubmitOrCancel from "../SubmitOrCancelForm";




export default function CreditCardForm() {

     // more for organizational preferences really
     
     return(
          <div className="loanForm" id="scrollToTop">

               <Alert show={alertShowState} variant="info" dismissible onClose={() => setAlertShowState(false)}>
                    <Alert.Heading>Please Note</Alert.Heading>
                    Credit Card payments within this app will need to be manually updated with your upcoming payment, as this app does not track purchases made with a credit card. For that reason, not a lot of data is needed.
                    <br></br>
                    <strong>You can regularly update the next payment amount by clicking the "View Loan" button on that credit card</strong>
               </Alert>

               <GeneralLoanInfo/>

               <CurrentPayment/>

               <OptionalLoanInfo/>

               <SubmitOrCancel/>

          </div>
     );

}