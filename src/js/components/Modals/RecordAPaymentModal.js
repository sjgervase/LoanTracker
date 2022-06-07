import React, { useEffect, useState } from "react";

// import from electron
import { ipcRenderer } from "electron";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import store actions
import { addPaymentOrLateFeeToLoan } from "../../Redux/features/LoansSlice";

// import from react bootstrap
import { Button, Modal, Form } from "react-bootstrap";

// import from react currency field
import CurrencyInput from "react-currency-input-field";


export default function RecordAPaymentModal(props) {

     const dispatch = useDispatch();

     // get some data from props. these are passed differently so the value is a ternary if
     let thisGUID = (props.parent.name == "LoanItemView" ? props.loan?.loan.GUID : props.loan?.GUID);
     let thisMonthlyPayment = (props.parent.name == "LoanItemView" ? props.loan?.loan.MonthlyPayment : props.loan?.MonthlyPayment);
     let thisDesiredMonthlyPayment = (props.parent.name == "LoanItemView" ? props.loan?.loan.DesiredMonthlyPayment : props.loan?.DesiredMonthlyPayment);

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     // state for showing or hiding the record payment modal
     const [showModal, setShowModal] = useState(false);

     // state for capturing record a payment function
     const [recordPaymentState, setRecordPaymentState] = useState({
          GUID: thisGUID,
          Type: "payment",
          Date: dateDefaultToday()
     });

     // functions to show or hide the record payment modal
     const showPaymentModalFunc = () => setShowModal(true);
     const hidePaymentModalFunc = () => {
          // clear the state 
          setRecordPaymentState({
               GUID: thisGUID,
               Type: "payment",
               Date: dateDefaultToday()
          });
          // hide the modal
          setShowModal(false);
     }

     // function that ensures the "record a payment" modal captures the entered value
     const recordPaymentStateFunc = (value, name) => {
          setRecordPaymentState({ ...recordPaymentState, [name]: value })
     }
     
     // set the default date picker value to today
     function dateDefaultToday() {
          let today = new Date();
          let formattedToday = today.toISOString().split('T')[0]
          return formattedToday;
     }


     // function to submit entered data from "record a payment modal"
     function submitRecordedPayment() {
          console.log(recordPaymentState);

          // dispatch the action to the store
          dispatch(addPaymentOrLateFeeToLoan(recordPaymentState));
          
          // ipcRenderer.invoke('newPaymentSubmission', (recordPaymentState));
          // hide the modal
          setShowModal(false);
     }

     return(
          <>
          
               <Button
                    variant="light"
                    // conditional classname depending on the parent of the button
                    className={`${props.parent.name == "ActiveLoanItem" ? "btn-sm btn-custom btn-light py0": "btn-custom btn-light"}`}
                    size="lg"
                    onClick={showPaymentModalFunc}>
                    Record a Payment
               </Button>

               <Modal
                    show={showModal}
                    onHide={hidePaymentModalFunc}
                    backdrop="static"
                    keyboard={false}
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Record a Payment</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                         
                    <p>Your Monthly Payment is: {moneyFormatter(thisMonthlyPayment)}</p>

                    {/* conditional to show desired monthly payment if it is not the default value of 0 */}
                    {thisDesiredMonthlyPayment > 0 ?  <p>Your Desired Monthly Payment is: {moneyFormatter(thisDesiredMonthlyPayment)}</p> : ""}
                    

                         <Form>
                              {/* Amount Paid */}
                              <Form.Group className="mb-3">
                                   <Form.Label>Amount Paid</Form.Label>
                                   <CurrencyInput
                                        prefix="$"
                                        name="Amount"
                                        placeholder="ex $10,000"
                                        decimalScale={2}
                                        decimalsLimit={2}
                                        defaultValue={thisDesiredMonthlyPayment == 0 ? thisMonthlyPayment : thisDesiredMonthlyPayment}
                                        onValueChange={(value, name) => recordPaymentStateFunc(value, name)}
                                        autoFocus
                                   />
                              </Form.Group>

                              {/* Date Paid */}
                              <Form.Group controlId="Date">
                                   <Form.Label>Date Paid</Form.Label>
                                   <Form.Control type="date" name="Date"
                                   defaultValue={dateDefaultToday()}
                                   onChange={e => recordPaymentStateFunc(e.target.value, e.target.name)} />
                              </Form.Group>

                         </Form>


                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={() => hidePaymentModalFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitRecordedPayment()}
                         disabled={!(recordPaymentState.hasOwnProperty("Amount")) || !(recordPaymentState.hasOwnProperty("Date")) ? true : false}>
                              Record
                         </Button>
                    </Modal.Footer>
               </Modal>
               
          </>
     );
}

