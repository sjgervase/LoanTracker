import React, { useState } from "react";

// import from electron
import { ipcRenderer } from "electron";

// import store actions
import { addPaymentOrLateFeeToLoan } from "../../Redux/features/LoansSlice";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import from react bootstrap
import { Button, Modal, Popover, OverlayTrigger, Form } from "react-bootstrap";

// import from react currency field
import CurrencyInput from "react-currency-input-field";


export default function RecordALateFeeModal(props) {

     const dispatch = useDispatch();

     let thisGUID = props.loan?.loan.GUID;

     // state for showing or hiding the record LateFee modal
     const [showModal, setShowModal] = useState(false);

     // state for capturing record a LateFee function
     const [recordLateFeeState, setRecordLateFeeState] = useState({
          GUID: thisGUID,
          Type: "lateFee",
          Date: dateDefaultToday()
     });


     // functions to show or hide the record LateFee modal
     const showLateFeeModalFunc = () => setShowModal(true);
     const hideLateFeeModalFunc = () => {
          // clear the state 
          setRecordLateFeeState({
               GUID: thisGUID,
               Type: "lateFee",
               Date: dateDefaultToday()
          });
          // hide the modal
          setShowModal(false);
     }


     // function that ensures the "record a late fee" modal captures the entered value
     const recordLateFeeStateFunc = (value, name) => {
          setRecordLateFeeState({ ...recordLateFeeState, [name]: value })
     }

     // set the default date picker value to today
     function dateDefaultToday() {
          let today = new Date();
          let formattedToday = today.toISOString().split('T')[0]
          return formattedToday;
     }


     // function to submit entered data from "record a Late Fee modal"
     function submitRecordedLateFee() {
          // dispatch the action to the store
          dispatch(addPaymentOrLateFeeToLoan(recordLateFeeState));

          // hide the modal
          setShowModal(false);
     }


     return(
          <>
          
               <Button
                    variant="danger"
                    onClick={showLateFeeModalFunc}
                    size="lg">
                    
                    Record a Late Fee
               </Button>

               <Modal
                    show={showModal}
                    onHide={hideLateFeeModalFunc}
                    backdrop="static"
                    keyboard={false}
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Record a Late Fee</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                         <Form>

                              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                   <Form.Label>Fee Amount</Form.Label>
                                   <CurrencyInput
                                        prefix="$"
                                        name="Amount"
                                        placeholder="ex $100"
                                        decimalScale={2}
                                        decimalsLimit={2}
                                        onValueChange={(value, name) => recordLateFeeStateFunc(value, name)}
                                        autoFocus
                                   />
                              </Form.Group>

                              
                              <Form.Group controlId="Date">
                                   <Form.Label>Date Issued</Form.Label>
                                   <Form.Control type="Date" name="Date"
                                   defaultValue={dateDefaultToday()}
                                   onChange={e => recordLateFeeStateFunc(e.target.value, e.target.name)} />
                              </Form.Group>

                         </Form>


                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={() => hideLateFeeModalFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitRecordedLateFee()}
                         disabled={!(recordLateFeeState.hasOwnProperty("Amount")) || !(recordLateFeeState.hasOwnProperty("Date")) ? true : false}>
                              Record
                         </Button>
                    </Modal.Footer>
               </Modal>
               
          </>
     );
}

