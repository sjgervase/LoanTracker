import React, { useEffect, useRef, useState } from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import store actions
import { addLoan } from "../../../Redux/features/LoansSlice";

// import from react-bootstrap
import { Form, Button, Alert, ButtonGroup, ToggleButton, OverlayTrigger, Popover } from "react-bootstrap";

// import from currency field
import CurrencyInput from "react-currency-input-field";

import BigNumber from "bignumber.js";

// import from react-icons
import { AiFillCar, AiFillHome } from "react-icons/ai"; 
import { FaGraduationCap, FaUser, FaCreditCard, FaInfoCircle, FaCalculator, FaCar } from "react-icons/fa";

// import from react-router-dom
import { useNavigate } from "react-router-dom";

// import tranistion
import { CSSTransition } from "react-transition-group";


// import form components
import GeneralLoanInfo from "../GeneralLoanInfo";
import RepaymentOptions from "./RepaymentOptions";

// // shared components
import OptionalLoanInfo from "../OptionalInfo";
import SubmitOrCancel from "../SubmitOrCancelForm";




export default function AmortizedLoanForm() {

     // more for organizational preferences really
     
     return(
          <div className="loanForm">

               <GeneralLoanInfo/>

               <RepaymentOptions/>

               <OptionalLoanInfo/>

               <SubmitOrCancel/>

          </div>
     );

}