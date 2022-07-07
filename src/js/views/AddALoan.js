import React, { useEffect, useRef, useState } from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

import { addFieldToFormData, clearFormData } from "../Redux/features/AddALoanSlice";

// import from react-bootstrap
import { Form, Button, Alert, ButtonGroup, ToggleButton, OverlayTrigger, Popover } from "react-bootstrap";

// import from currency field
import CurrencyInput from "react-currency-input-field";

import BigNumber from "bignumber.js";

// import from react-router-dom
import { useLocation, useNavigate } from "react-router-dom";

// import from react-icons
import { AiFillCar, AiFillHome } from "react-icons/ai"; 
import { FaGraduationCap, FaUser, FaCreditCard, FaInfoCircle, FaCalculator, FaCar } from "react-icons/fa";

// import tranistion
import { CSSTransition, SwitchTransition, TransitionGroup } from "react-transition-group";


// import forms
import AmortizedLoanForm from "../components/AddALoanComponents/AmortizedLoans/AmortizedLoanForm";
import CreditCardForm from "../components/AddALoanComponents/CreditCards/CreditCardForm";



export default function AddALoan() {

     const dispatch = useDispatch();

     const formState = useSelector(state => state.addaloan);
     // console.log(formState);
     
     // get data from redux store
     // only loans are needed
     const loansState = useSelector((state) => state.loans);

     // state for GUID, reads all current guids and generates unique GUIDS
     const guidGenerator = () => {
          // create empty array to be populated by all guids currently in the file
          let guidArray = [];

          // for each loan item
          for (let i = 0; i < loansState.loans.length; i++) {
               guidArray.push(loansState.loans[i].loan.GUID);
          }

          // generate 20 digit GUID for album and album art
          let randomGUID = (length = 20) => {
               let str = "";
               // create a GUID within a while loop. this will loop infinitely until a GUID is not already being used
               while (true) {
                    // Declare all characters
                    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                    // Pick characers randomly and add them to "str" variable to create random string
                    for (let i = 0; i < length; i++) {
                         str += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    // if str is not being used as a GUID already, break the while loop
                    if (!(guidArray.includes(str))) {
                         break;
                    }
               }
               return str;
          };
          return randomGUID();
     }

     // useEffect to push a new guid to the form state when the page is loaded
     useEffect(() => {
          // dispatch action to add to state
          dispatch(addFieldToFormData({GUID:guidGenerator()}))
     }, [])



    

     // loanTypeRadios is an array of objects to quickly map loan types
     const loanTypeRadios = [
          {
               name: 'Student Loan',
               img: <FaGraduationCap/>,
               value: 'StudentLoan'
          },

          {
               name: 'Mortgage',
               img: <AiFillHome/>,
               value: 'Mortgage'
          },

          {
               name: 'Vehicle Loan',
               img: <FaCar/>,
               value: 'VehicleLoan'
          },

          {
               name: 'Personal Loan',
               img: <FaUser/>,
               value: 'PersonalLoan'
          },

          {
               name: 'Credit Card',
               img: <FaCreditCard/>,
               value: 'CreditCard'
          }
     ];



     
     // initially hide the form types
     const [formTypeState, setFormTypeState] = useState(false);

     function loanTypeSelection(value) {
          switch (value) {
               case 'StudentLoan':
                    // set the form type to true to reveal with react transition group
                    setFormTypeState('amortized');
                    // clear the form data then dispatch action to add to state
                    dispatch(addFieldToFormData({LoanCategory:"StudentLoan"}))
               break;

               case 'Mortgage':
                    // set the form type to true to reveal with react transition group
                    setFormTypeState('amortized');
                    // clear the form data then dispatch action to add to state
                    dispatch(addFieldToFormData({LoanCategory:"Mortgage"}))
               break;

               case 'VehicleLoan':
                    // set the form type to true to reveal with react transition group
                    setFormTypeState('amortized');
                    // clear the form data then dispatch action to add to state
                    dispatch(addFieldToFormData({LoanCategory:"VehicleLoan"}))
               break;

               case 'PersonalLoan':
                    // set the form type to true to reveal with react transition group
                    setFormTypeState('amortized');
                    // clear the form data then dispatch action to add to state
                    dispatch(addFieldToFormData({LoanCategory:"PersonalLoan"}))
               break;

               case 'CreditCard':
                    // set the form type to true to reveal with react transition group
                    setFormTypeState('credit');
                    // clear the form data then dispatch action to add to state
                    dispatch(addFieldToFormData({LoanCategory:"CreditCard"}))
               break;

               default:
                    // set the form type to true to reveal with react transition group
                    // clear the form data then dispatch action to add to state
                    dispatch(clearFormData());
                    setShowAmortizedLoanForm(false);
                    setShowCreditCardForm(false);
               break;
          }
     }


     // useEffect(() => {
     //      console.log(formState.formData);
     // }, [formState.formData])



     
     return(
          <div className="componentContainer">
               <h1 className="componentTitle">Add a New Loan</h1>
               <div className="dashboardModulesContainer addALoanForm">


                    <div id="topOfPage" className="dashboardModule typeOfLoan">
                         {/* https://www.investopedia.com/terms/a/amortized_loan.asp */}

                         <div className="moduleHeader">
                              <h2>Type of Loan</h2>
                         </div>

                         <div className="moduleContent typeOfLoanContent">
                              {loanTypeRadios.map((radio, idx) => (
                                   <ButtonGroup key={`loanTypeButtonGroup-${idx}`} className="mb-2 loanTypeButtonGroup">  
                                        <ToggleButton
                                        id={`loanTypeRadio-${idx}`}
                                        type="radio"
                                        variant="outline-success"
                                        name="loanTypeRadio"
                                        className="loanTypeButton"
                                        value={radio.value}
                                        checked={formState.formData.LoanCategory === radio.value}
                                        onChange={e => loanTypeSelection(e.target.value)}>

                                             <div className="loanTypeIMG">{radio.img}</div>
                                             <h5>{radio.name}</h5>
                                        </ToggleButton>
                                   </ButtonGroup>
                              ))}
                         </div>
                    </div>




                    <CSSTransition
                    in={formTypeState !== false}
                    unmountOnExit
                    timeout={500}
                    classNames="revealLoanForm">


                         <SwitchTransition>

                         <CSSTransition
                         key={formTypeState === 'amortized' ? true : false}
                         timeout={500}
                         classNames="switchLoanForm">

                              {formTypeState === 'amortized' ?
                                   <AmortizedLoanForm/>
                              :
                                   <CreditCardForm/>
                              }

                         </CSSTransition>
                         </SwitchTransition>

                    </CSSTransition>
               </div>

          </div>
     )
}