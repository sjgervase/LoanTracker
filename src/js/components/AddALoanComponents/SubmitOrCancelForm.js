import React, { useEffect, useRef, useState } from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import store actions
import { enterValidationMode } from "../../Redux/features/AddALoanSlice";

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



export default function SubmitOrCancel(props) {

     const dispatch = useDispatch()

     const dataValidator = () => {
          dispatch(enterValidationMode())
     }


     // cancel the form and navigate to overview
     const navigate = useNavigate();
     function cancel() {
          // add "are you sure" popup
          // return to overview
          navigate('/');
     }

     return(
          <div className="addALoanSubmitCancel dashboardModule">
               <Button variant="outline-danger" size="lg" type="cancel" onClick={() => cancel()}>
                    Cancel
               </Button>

               <Button variant="success" size="lg" onClick={() => dataValidator()}>
                    Submit
               </Button>
          </div>
     )
}