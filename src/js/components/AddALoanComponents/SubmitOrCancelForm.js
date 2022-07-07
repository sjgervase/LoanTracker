import React, { useEffect, useRef, useState } from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import store actions
import { clearFormData, validationMode } from "../../Redux/features/AddALoanSlice";
import { addLoan } from "../../Redux/features/LoansSlice";

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

// import components
import AreYouSureYouWantToCancel from "../Modals/AreYouSureYouWantToCancel";
import LoadingModal from "../Modals/LoadingModal";



export default function SubmitOrCancel() {

     const dispatch = useDispatch();

     const formState = useSelector(state => state.addaloan);

     const navigate = useNavigate();



     // loading modal state
     const [showModal, setShowModal] = useState(false);
     const [loadingTimeState, setLoadingTimeState] = useState(
          Math.floor(Math.random() * (2000 - 501) + 500)
     );



     // enter validation mode on click of submit button
     const dataValidator = () => {
          dispatch(validationMode(true))
     }


     // useEffect to listen errors
     useEffect(() => {
          // switch for different error values
          switch (formState.errors) {
               case null:
                    // console.log('initial');
               break;

               case false:
                    // submit the data
                    dispatch(addLoan(formState.formData));

                    // clear the data
                    dispatch(clearFormData());

                    // show 2 second load modal for fun
                    setShowModal(true);
                    setTimeout(successfulSubmission, loadingTimeState)
               break;

               case true:
                    // exit validation mode
                    dispatch(validationMode(false))
               break;
          }
     }, [formState.errors])



     function successfulSubmission() {
          // navigate to home
          navigate('/');
     }



     
     

     return(
          <div className="addALoanSubmitCancel dashboardModule">

               <LoadingModal
               showModal={showModal}/>

               <AreYouSureYouWantToCancel/>
               

               <Button variant="success" size="lg" onClick={() => dataValidator()}>
                    Submit
               </Button>
          </div>
     )
}