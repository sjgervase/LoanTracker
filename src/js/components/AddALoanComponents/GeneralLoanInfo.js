import React, { useEffect, useRef, useState } from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import store actions
import { addFieldToFormData } from "../../Redux/features/AddALoanSlice";

// import from react-bootstrap
import { Form, Row, Button, Alert, ButtonGroup, ToggleButton, OverlayTrigger, Popover, Col } from "react-bootstrap";

// import react icons
import { FaGraduationCap, FaUser, FaCreditCard, FaInfoCircle, FaCalculator, FaCar } from "react-icons/fa";

// import from currency field
import CurrencyInput from "react-currency-input-field";



export default function RequiredLoanInfo(props) {

     const dispatch = useDispatch();

     const formState = useSelector(state => state.addaloan);

     // useEffect to dispatch action to add default color to form data 
     useEffect(() => {
          dispatch(addFieldToFormData({LoanColor:"#36733F"}))
     }, [])

     // state to ensure the formatting of the payment date
     const [paymentDateState, setPaymentDateState] = useState("");

     // function to verify the payment date is a number greater than 0 and less than 32
     const paymentDateVerifier = (value) => {
          // ensure a number
          let formattedValue = value.replace(/\D/g, "");

          // if the new value is more than 0 or less than 32 or blank, allow it 
               // blank bc the user may delete the default value to enter their own
          if (formattedValue > 0 && formattedValue < 32 || formattedValue == "") {
               // set the form state value

               // dispatch action to add field
               dispatch(addFieldToFormData({PaymentDate:formattedValue}));
               
               setPaymentDateState(formattedValue)
          }
     }


     // function to have the proper ordinal next to the payment date
     function nextDateGenerator() {
          let ordinal;

          // if not a number, return blank
          if (isNaN(paymentDateState) || paymentDateState === "") {
               ordinal = ""
               
          } else {
               // create empty object to be populated below, for only one return option from this function
               let returnObjStrings = {};

               // get the todays date number 
               let today = new Date();
               let dd = String(today.getDate()).padStart(2, '0'); // gets the day

               // array of all month names to return
               const monthNames = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"
               ];

               // create array of all day names to return
               var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

               // return proper ordinal
               if (paymentDateState > 3 && paymentDateState < 21) {
                    ordinal = "th";
               } else {
                    switch (paymentDateState % 10) {
                         case 1: ordinal = "st"; break;
                         case 2: ordinal = "nd"; break;
                         case 3: ordinal = "rd"; break;
                         default: ordinal = "th"; break;
                    }
               }

               // calculate the difference in days
               let dateDiff = parseInt(paymentDateState) - parseInt(dd);

               if (dateDiff > 0) {
                    // its due this month, easy calculation
                    // ex due in 6 days

                    // set the date value to the day of payment
                    today.setDate(paymentDateState);
                    
                    // set return objects
                    returnObjStrings.monthName = monthNames[today.getMonth()];
                    returnObjStrings.dayName = days[today.getDay()];
                    returnObjStrings.daysTilPayment = dateDiff;
               
               } else {
                    // due next month
                    // get next month from todays 
                    var nextMonthDate = new Date(today.setMonth(today.getMonth()+1));

                    // get the payment date of next month
                    nextMonthDate.setDate(paymentDateState);

                    // ensure it doesnt break in december as january might be 0
                    let timeDifferenceMS = nextMonthDate - new Date();

                    // convert ms to days
                    let timeDiffDays = timeDifferenceMS/(1000*60*60*24);

                    // set return objects
                    returnObjStrings.monthName = monthNames[nextMonthDate.getMonth()];
                    returnObjStrings.dayName = days[nextMonthDate.getDay()];
                    returnObjStrings.daysTilPayment = Math.ceil(timeDiffDays);
               }

               return(
                    <div className="nextPaymentReturn">
                         <h6>Is this Correct?</h6>
                         <span>
                              Your next payment is due in {returnObjStrings.daysTilPayment} {returnObjStrings.daysTilPayment === 1 ? "day" : "days"} on {returnObjStrings.dayName}, {returnObjStrings.monthName} {paymentDateState}{ordinal}
                         </span>
                    </div>
               );
          }

     }


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

               // if loan name is blank or spaces
               if (formState.formData.LoanName == undefined || formState.formData.LoanName.match(/^ *$/) !== null || formState.formData.LoanName == "") {
                    // push the erroneous field name to array
                    errorFieldsArray.push("LoanName");
               }

               // if disbursement date is blank
               if(formState.formData.DisbursementDate == undefined || formState.formData.DisbursementDate == "") {
                    // push the erroneous field name to array
                    errorFieldsArray.push("DisbursementDate");
               }
               
               // if payment due date is blank (field forces positive integers)
               if(formState.formData.PaymentDate == undefined || formState.formData.PaymentDate == "") {
                    // push the erroneous field name to array
                    errorFieldsArray.push("PaymentDate");
               }

               // set the error fields state to the array
               setErrorFields(errorFieldsArray);
          
          // if false
          } else {
               console.log("dont validate now");
          }

     }, [formState.validate])




     // Overlay triggers listed as consts to keep return easier to read
     const colorOverlay = (
          <OverlayTrigger
          placement="top"
          overlay={
               <Popover id="popover-basic" className="customPopover">
                    <Popover.Header as="h3" className="customPopoverHeader">Loan Color</Popover.Header>
                    <Popover.Body className="customPopoverBody">
                         <span>Click the box below to select a color for color-coded lists and graphs. This can be whatever you'd like.</span>
                    </Popover.Body>
               </Popover>
          }>
               <div className="addALoanHelpOverlay">
                    <FaInfoCircle/>
               </div>
          </OverlayTrigger>
     );

     const dispersmentDateOverlay = (
          <OverlayTrigger
          placement="top"
          overlay={
               <Popover id="popover-basic" className="customPopover">
                    <Popover.Header as="h3" className="customPopoverHeader">Disbursement Date</Popover.Header>
                    <Popover.Body className="customPopoverBody">
                         <span>The day the loan was given to you.</span>
                    </Popover.Body>
               </Popover>
          }>
               <div className="addALoanHelpOverlay">
                    <FaInfoCircle/>
               </div>
          </OverlayTrigger>
     );

     const paymentDateOverlay = (
          <OverlayTrigger
          placement="top"
          overlay={
               <Popover id="popover-basic" className="customPopover">
                    <Popover.Header as="h3" className="customPopoverHeader">Payment Due Date</Popover.Header>
                    <Popover.Body className="customPopoverBody">
                         <span>This is the day that you must pay your monthly payment. If you pay on the 18th of each month, enter the number 18.</span>
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
                    <h2>General Loan Information</h2>
               </div>


               <Form className="componentForm">
                    <Row>
                         <Col xs={7}>
                              {/* Loan Name */}
                              <Form.Group controlId="LoanName">
                                   <Form.Label className="addALoanFormLabel">Loan Name</Form.Label>
                                   <Form.Control
                                        type="Text"
                                        name="LoanName"
                                        isInvalid={formState.validate && errorFields.includes("LoanName")}
                                        placeholder="You can name it whatever you'd like, it's just for you to keep track of it"
                                        onChange={e => handleChange(e.target.name, e.target.value)}
                                   />
                                   <Form.Control.Feedback type="invalid">
                                        Ensure the entered Loan Name is not blank or comprised only of spaces
                                   </Form.Control.Feedback>
                              </Form.Group>
                         </Col>

                         <Col>
                              {/* Color */}
                              <Form.Group controlId="ColorPicker" className="colorPickerDiv">
                                   <div className="addALoanFormLabel">
                                        <Form.Label>Loan Color</Form.Label>
                                        {colorOverlay}
                                   </div>
                                   <Form.Control
                                        name="LoanColor"
                                        type="color"
                                        defaultValue="#36733F"
                                        title="Choose your color"
                                        onChange={e => handleChange(e.target.name, e.target.value)}
                                   />
                                   <Form.Control.Feedback type="invalid">
                                        Ensure the entered Loan Name is not blank or comprised only of spaces
                                   </Form.Control.Feedback>
                              </Form.Group>     
                         </Col>
                    </Row>

                    <Row>
                         <Col>
                              {/* Disbursement Date */}
                              <Form.Group controlId="DisbursementDate" className="disbursementDateDiv">
                                   <div className="addALoanFormLabel">
                                        <Form.Label>Disbursement Date</Form.Label>
                                        {dispersmentDateOverlay}
                                   </div>
                                   <Form.Control
                                        type="date"
                                        isInvalid={formState.validate && errorFields.includes("DisbursementDate")}
                                        name="DisbursementDate"
                                        onChange={e => handleChange(e.target.name, e.target.value)}
                                   />
                                   <Form.Control.Feedback type="invalid">
                                        Ensure the entered Disbursement Date is not blank
                                   </Form.Control.Feedback>
                              </Form.Group>
                         </Col>

                         <Col>
                              {/* Payment Date */}
                              <Form.Group controlId="PaymentDate" className="paymentDateDiv">
                                   <div className="addALoanFormLabel">
                                        <Form.Label>Payment Due Date</Form.Label>
                                        {paymentDateOverlay}
                                   </div>
                                   <Form.Control
                                        type="text"
                                        placeholder="6"
                                        isInvalid={formState.validate && errorFields.includes("PaymentDate")}
                                        value={paymentDateState}
                                        onChange={e => paymentDateVerifier(e.target.value)}
                                   />
                                   <Form.Control.Feedback type="invalid">
                                        Ensure that Payment Date is not blank
                                   </Form.Control.Feedback>
                              </Form.Group>
                         </Col>

                         <Col>
                              <div className="nextDateGeneratorDiv">
                                   {nextDateGenerator()}
                              </div>
                         </Col>
                    </Row>
               </Form>
          </div>
     )
}