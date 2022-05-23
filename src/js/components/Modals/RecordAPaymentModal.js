import React, { useState } from "react";

// import from electron
import { ipcRenderer } from "electron";

// import from react bootstrap
import { Button, Modal, Form } from "react-bootstrap";

// import from react currency field
import CurrencyInput from "react-currency-input-field";


export default function RecordAPaymentModal(props) {


     // get the guid. this has passed differently based on the view, so its an if
     let thisGUID = (props.parent.name == "LoanItemView" ? props.loan?.loan.GUID : props.loan?.GUID);

     

     

     // state for showing or hiding the record payment modal
     const [showPaymentModalState, setPaymentModalState] = useState(false);

     // state for capturing record a payment function
     const [recordPaymentState, setRecordPaymentState] = useState({GUID: thisGUID});


     // functions to show or hide the record payment modal
     const showPaymentModalFunc = () => setPaymentModalState(true);
     const hidePaymentModalFunc = () => {
          // clear the state 
          setRecordPaymentState({GUID: thisGUID});
          // hide the modal
          setPaymentModalState(false);
     }

     // function that ensures the "record a payment" modal captures the entered value
     const recordPaymentStateFunc = (value, name) => {
          setRecordPaymentState({ ...recordPaymentState, [name]: value })
     }


     // function to submit entered data from "record a payment modal"
     function submitRecordedPayment() {
          console.log(submitRecordedPayment);
          

          ipcRenderer.invoke('newPaymentSubmission', (recordPaymentState));

          // hide the modal
          setPaymentModalState(false);
     }
     

     // conditional classnames on button:
     // className="btn-sm btn-custom btn-light py0" if parent is loanitem



     return(
          <>
          
               <Button
                    variant="light"
                    // conditional classname depending on the parent of the button
                    className={`${props.parent.name == "LoanItem" ? "btn-sm btn-custom btn-light py0": "btn-custom btn-light"}`}
                    onClick={showPaymentModalFunc}>
                    Record a Payment
               </Button>

               <Modal
                    show={showPaymentModalState}
                    onHide={hidePaymentModalFunc}
                    backdrop="static"
                    keyboard={false}
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Record a Payment</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                         <Form>

                              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                   <Form.Label>Amount Paid</Form.Label>
                                   <CurrencyInput
                                        prefix="$"
                                        name="Payment"
                                        placeholder="ex $10,000"
                                        decimalScale={2}
                                        decimalsLimit={2}
                                        defaultValue={props.loan?.loan?.MonthlyPayment}
                                        onValueChange={(value, name) => recordPaymentStateFunc(value, name)}
                                        autoFocus
                                   />
                              </Form.Group>

                              {/* Disbursement Date */}
                              <Form.Group controlId="Date">
                                   <Form.Label>Date Paid</Form.Label>
                                   <Form.Control type="date" name="Date"
                                   onChange={e => recordPaymentStateFunc(e.target.value, e.target.name)} />
                              </Form.Group>

                         </Form>


                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={() => hidePaymentModalFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitRecordedPayment()}>
                              Record
                         </Button>
                    </Modal.Footer>
               </Modal>
               
          </>
     );
}

