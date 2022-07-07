import React from "react";

// import from react-redux
import {  useSelector } from "react-redux";


// import form components
import GeneralLoanInfo from "../GeneralLoanInfo";
import RepaymentOptions from "./RepaymentOptions";

// // shared components
import OptionalLoanInfo from "../OptionalInfo";
import SubmitOrCancel from "../SubmitOrCancelForm";




export default function AmortizedLoanForm() {

     // more for organizational preferences really
     
     return(
          <div className="loanForm" id="scrollToTop">

               <GeneralLoanInfo/>

               <RepaymentOptions/>

               <OptionalLoanInfo/>

               <SubmitOrCancel/>

          </div>
     );

}