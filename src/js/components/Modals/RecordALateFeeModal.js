import React, { useState } from "react";

// import from electron
import { ipcRenderer } from "electron";

// import from react bootstrap
import { Button, Modal, Popover, OverlayTrigger, Form } from "react-bootstrap";

// import from react currency field
import CurrencyInput from "react-currency-input-field";


export default function RecordALateFeeModal(props) {

     // console.log(props.parent.name);

     // state for showing or hiding the record LateFee modal
     const [showLateFeeModalState, setLateFeeModalState] = useState(false);

     // state for capturing record a LateFee function
     const [recordLateFeeState, setRecordLateFeeState] = useState({GUID: props.loan?.loan?.GUID});


     // functions to show or hide the record LateFee modal
     const showLateFeeModalFunc = () => setLateFeeModalState(true);
     const hideLateFeeModalFunc = () => {
          // clear the state 
          setRecordLateFeeState({
               GUID: props.loan?.loan.GUID
          });
          // hide the modal
          setLateFeeModalState(false);
     }


     // function that ensures the "record a late fee" modal captures the entered value
     const recordLateFeeStateFunc = (value, name) => {
          setRecordLateFeeState({ ...recordLateFeeState, [name]: value })
     }


     // function to submit entered data from "record a Late Fee modal"
     function submitRecordedLateFee() {
          // console.log(recordLateFeeState);

          ipcRenderer.invoke('newLateFeeSubmission', (recordLateFeeState));

          // hide the modal
          setLateFeeModalState(false);
     }
     

// conditional classnames on button:
// className="btn-sm btn-custom btn-light py0" if parent is loanitem



     return(
          <>
          
               <Button
                    variant="outline-danger"
                    onClick={showLateFeeModalFunc}>
                    
                    Record a Late Fee
               </Button>

               <Modal
                    show={showLateFeeModalState}
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
                                        name="LateFee"
                                        placeholder="ex $100"
                                        decimalScale={2}
                                        decimalsLimit={2}
                                        onValueChange={(value, name) => recordLateFeeStateFunc(value, name)}
                                        autoFocus
                                   />
                              </Form.Group>

                              
                              <Form.Group controlId="Date">
                                   <Form.Label>Date Issued</Form.Label>
                                   <Form.Control type="date" name="Date"
                                   onChange={e => recordLateFeeStateFunc(e.target.value, e.target.name)} />
                              </Form.Group>

                         </Form>


                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={() => hideLateFeeModalFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitRecordedLateFee()}>
                              Record
                         </Button>
                    </Modal.Footer>
               </Modal>
               
          </>
     );
}

