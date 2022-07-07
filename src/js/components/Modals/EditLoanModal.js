import React, { useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, Modal, Row, Table } from "react-bootstrap";
import { ipcRenderer } from "electron";

// import action from store
import { editLoan } from "../../Redux/features/LoansSlice";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import from currency field
import CurrencyInput from "react-currency-input-field";


export default function EditLoanModal(props) {
     const dispatch = useDispatch();

     // state to hold the new changes to the loan item
     const [editFormState, setEditFormState] = useState();

     // set fields on initialization
     useEffect(() => {
          // if the guid exists
          if (props.currentLoan?.loan.GUID) {
               setEditFormState({
                    GUID: props.currentLoan?.loan.GUID,
                    LoanName: props.currentLoan?.loan.LoanName,
                    LoanColor: props.currentLoan?.loan.LoanColor,
                    PaymentDate: props.currentLoan?.loan.PaymentDate,
                    InterestRate: props.currentLoan?.loan.InterestRate,
                    LoanLink: props.currentLoan?.loan.LoanLink,
                    AdditionalNotes: props.currentLoan?.loan.AdditionalNotes
               })
          }
     }, [props.currentLoan?.loan.GUID])

     // function to handle the changes made to this form
     // function to handle changes to form fields
     const handleChange = (name, value) => {
          // dispatch the action to the store
          setEditFormState({
               ...editFormState,
               [name]: value
          })
     }


     // useEffect(() => {
     //      console.log(editFormState);
     // }, [editFormState])

     // state to show delete modal
     const [showModal, setShowModal] = useState(false);

     const handleDeleteModalClose = () => setShowModal(false);
     const handleDeleteModalShow = () => setShowModal(true);


     
     // state to ensure the formatting of the payment date
     const [paymentDateState, setPaymentDateState] = useState(props.currentLoan?.loan.PaymentDate);

     // function to verify the payment date is a number greater than 0 and less than 32
     const paymentDateVerifier = (value) => {
          // ensure a number
          let formattedValue = value.replace(/\D/g, "");

          // if the new value is more than 0 or less than 32 or blank, allow it 
               // blank bc the user may delete the default value to enter their own
          if (formattedValue > 0 && formattedValue < 32 || formattedValue == "") {
               // set the form state value
               
               setPaymentDateState(formattedValue)
               handleChange("PaymentDate", formattedValue)
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


     // handle submission
     const submitChanges = () => {
          dispatch(editLoan(editFormState));
     }

     return(
          <>
               <Button 
               variant="info" 
               className="btn-sm btn-custom py0" 
               onClick={handleDeleteModalShow}>
                    Edit Loan
               </Button>

               <Modal
                    show={showModal}
                    onHide={handleDeleteModalClose}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Edit {props.currentLoan?.loan.LoanName}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                         <h6 className="lead">You can only edit some fields, as others are used in major calculations. If the changes needed are more drastic, you can always add the loan again and select "Payback from Current Loan Amount" in the "Repayment Options" window.</h6>
                         <br></br>


                         <Form>
                              <Row>
                                   <Col xs={7}>
                                        {/* Loan Name */}
                                        <Form.Group controlId="LoanName">
                                             <Form.Label className="addALoanFormLabel">Loan Name</Form.Label>
                                             <Form.Control
                                                  type="Text"
                                                  name="LoanName"
                                                  defaultValue={props.currentLoan?.loan.LoanName}
                                                  placeholder="You can name it whatever you'd like, it's just for you to keep track of it"
                                                  onChange={e => handleChange(e.target.name, e.target.value)}
                                             />
                                        </Form.Group>
                                   </Col>

                                   <Col>
                                        {/* Color */}
                                        <Form.Group controlId="ColorPicker" className="colorPickerDiv">
                                             <Form.Label>Loan Color</Form.Label>

                                             <div className="colorControlAndButton">
                                                  <Form.Control
                                                       name="LoanColor"
                                                       type="color"
                                                       defaultValue={props.currentLoan?.loan.LoanColor}
                                                       title="Choose your color"
                                                       onChange={e => handleChange(e.target.name, e.target.value)}
                                                  />
                                             </div>
                                        </Form.Group>
                                   </Col>
                              </Row>

                              <Row>
                                   <Col>
                                        {/* Payment Date */}
                                        <Form.Group controlId="PaymentDate" className="paymentDateDiv">
                                             <Form.Label>Payment Due Date</Form.Label>
                                             <Form.Control
                                                  type="text"
                                                  placeholder="ex 6"
                                                  defaultValue={props.currentLoan?.loan.PaymentDate}
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

                              <Row>
                                   <Col>
                                        {/* Interest Rate */}
                                        <Form.Group controlId="InterestRate" className="interestRateDiv">
                                             <Form.Label>Interest Rate (APR)</Form.Label>     
                                             <CurrencyInput
                                                  suffix="%"
                                                  name="InterestRate"
                                                  placeholder="ex 15%"
                                                  defaultValue={props.currentLoan?.loan.InterestRate}
                                                  decimalScale={2}
                                                  decimalsLimit={2}
                                                  allowNegativeValue={false}
                                                  className="form-control"
                                                  onValueChange={(value, name) => handleChange(name, value)}
                                             />
                                             <div className="invalid-feedback">Ensure Interest Rate is not blank</div>
                                        </Form.Group>
                                   </Col>

                                   <Col>
                                        {/* Loan Link */}
                                        <Form.Group controlId="LoanLink" className="loanLinkDiv">
                                             <Form.Label>Loan Link</Form.Label>
                                             <Form.Control type="Text" name="LoanLink" placeholder="ex www.bank.com/PayLoan" defaultValue={props.currentLoan?.loan.LoanLink}
                                             onChange={e => handleChange(e.target.name, e.target.value)}
                                             className="addALoanInput"/>
                                             <Form.Text className="text-muted">This is for quick access to make payments</Form.Text>
                                        </Form.Group>
                                   </Col>
                              </Row>

                              <Row>
                                   <Col>
                                        <Form.Group controlId="AdditionalNotes" className="additionalNotesDiv">
                                             <Form.Label>Additional Notes</Form.Label>
                                             <Form.Control as="textarea" rows={3} name="AdditionalNotes" placeholder="ex This Loan is for..." defaultValue={props.currentLoan?.loan.AdditionalNotes}
                                             onChange={e => handleChange(e.target.name, e.target.value)}
                                             className="addALoanInput addALoanTextArea"/>
                                             <Form.Text className="text-muted">Any other notes you want attached to this loan. NEVER include passwords in this box.</Form.Text>
                                        </Form.Group>
                                   </Col>
                              </Row>
                         </Form>
                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={handleDeleteModalClose}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={()=>submitChanges()}>
                              Submit
                         </Button>
                    </Modal.Footer>

               </Modal>

          </>
     )

}