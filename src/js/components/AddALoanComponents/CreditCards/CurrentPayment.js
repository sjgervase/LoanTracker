import React, { useEffect, useRef, useState } from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import store actions
import { addFieldToFormData, errorsExist, validationMode, repaymentOptionData } from "../../../Redux/features/AddALoanSlice";

// import from react-bootstrap
import { Form, Row, Button, Alert, ButtonGroup, ToggleButton, OverlayTrigger, Popover, Col } from "react-bootstrap";

// import react icons
import { FaGraduationCap, FaUser, FaCreditCard, FaInfoCircle, FaCalculator, FaCar } from "react-icons/fa";

// import from currency field
import CurrencyInput from "react-currency-input-field";



export default function CurrentPayment(props) {

     const dispatch = useDispatch();

     const formState = useSelector(state => state.addaloan);




     // function to handle changes to form fields
     const handleChange = (name, value) => {
          // dispatch the action to the store
          dispatch(addFieldToFormData({[name]:value}));
     }


     // error handling
     const [errorFields, setErrorFields] = useState([])
     // useEffect to watch the formstate.validate property. when true, all form components should validate their own fields
     useEffect(() => {
          // if true
          if (formState.validate) {
               console.log("validate now");
               // empty arrays to be populated if the fields are erroneous
               let errorFieldsArray = [];

               // if next payment amount is blank (field forces positive integers)
               if(formState.formData.NextPaymentAmount == undefined || formState.formData.NextPaymentAmount == "") {
                    // push the erroneous field name to array
                    errorFieldsArray.push("NextPaymentAmount");
               }

               // if next total balance is blank (field forces positive integers)
               if(formState.formData.TotalBalance == undefined || formState.formData.TotalBalance == "") {
                    // push the erroneous field name to array
                    errorFieldsArray.push("TotalBalance");
               }

               // if interest rate is blank (field forces positive integers)
               if(formState.formData.InterestRate == undefined || formState.formData.InterestRate == "") {
                    // push the erroneous field name to array
                    errorFieldsArray.push("InterestRate");
               }
               
               // set the error fields state to the array
               setErrorFields(errorFieldsArray);
               // if there are errors, dispatch action
               if (errorFieldsArray.length > 0) {
                    dispatch(errorsExist(true))
               } else {
                    dispatch(errorsExist(false))
               }
               // exit validation mode
               dispatch(validationMode(false))
          }
     }, [formState.validate])




     // Overlay triggers listed as consts to keep return easier to read
     const nextPaymentOverlay = (
          <OverlayTrigger
          placement="top"
          overlay={
               <Popover id="popover-basic" className="customPopover">
                    <Popover.Header as="h3" className="customPopoverHeader">Next Payment Amount</Popover.Header>
                    <Popover.Body className="customPopoverBody">
                         <span>
                              This is the amount that is due for your next credit card payment. 
                         </span>
                    </Popover.Body>
               </Popover>
          }>
               <div className="addALoanHelpOverlay">
                    <FaInfoCircle/>
               </div>
          </OverlayTrigger>
     );


     


     return (
          <div className="addALoanRequiredInfo dashboardModule">
               <div className="moduleHeader">
                    <h2>Current Payment Info</h2>
               </div>

               <Form className="componentForm">
                    <Row>
                         <Col xs={4}>
                              {/* Interest Rate */}
                              <Form.Group controlId="InterestRate" className="interestRateDiv">
                                   <Form.Label>Interest Rate (APR)</Form.Label>     
                                   <CurrencyInput
                                        suffix="%"
                                        name="InterestRate"
                                        placeholder="ex 15%"
                                        decimalScale={2}
                                        decimalsLimit={2}
                                        allowNegativeValue={false}
                                        className={`form-control ${formState.errors && errorFields.includes("InterestRate") ? "is-invalid" : ""}`}
                                        onValueChange={(value, name) => handleChange(name, value)}
                                   />
                                   <div className="invalid-feedback">Ensure Interest Rate is not blank</div>
                              </Form.Group>
                         </Col>
                    </Row>

                    <Row>
                         <Col xs={4}>
                              {/* Next Payment Amount */}
                              <Form.Group controlId="NextPaymentAmount" className="nextPaymentAmountDiv">
                                   <div className="addALoanFormLabel">
                                        <Form.Label>Next Payment Amount</Form.Label>
                                        {nextPaymentOverlay}
                                   </div>
                                   <CurrencyInput
                                        prefix="$"
                                        name="NextPaymentAmount"
                                        placeholder="ex $100"
                                        decimalScale={2}
                                        decimalsLimit={2}
                                        allowNegativeValue={false}
                                        className={`form-control ${formState.errors && errorFields.includes("NextPaymentAmount") ? "is-invalid" : ""}`}
                                        onValueChange={(value, name) => handleChange(name, value)}
                                   />
                                   <div className="invalid-feedback">Ensure Next Payment Amount is not blank</div>
                              </Form.Group>
                         </Col>

                         <Col>
                               {/* Interest Rate */}
                              <Form.Group controlId="TotalBalance" className="totalBalanceDiv">
                                   <Form.Label>Total Balance</Form.Label>
                                   <CurrencyInput
                                        prefix="$"
                                        name="TotalBalance"
                                        placeholder="ex $1500"
                                        decimalScale={2}
                                        decimalsLimit={2}
                                        allowNegativeValue={false}
                                        className={`form-control ${formState.errors && errorFields.includes("TotalBalance") ? "is-invalid" : ""}`}
                                        onValueChange={(value, name) => handleChange(name, value)}
                                   />
                                   <div className="invalid-feedback">Ensure Total Balance is not blank</div>
                              </Form.Group>   
                         </Col>
                    </Row>
               </Form>
          </div>
     )
}