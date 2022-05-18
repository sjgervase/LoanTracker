import React, { useEffect, useState } from "react";

import CurrencyInput from "react-currency-input-field";


import { Button, Form, Modal } from "react-bootstrap";







export default function AdjustMonthlyPaymentModal(props) {

     // state for showing or hiding the modal
     const [showAdjustMonthlyPaymentState, setAdjustMonthlyPaymentState] = useState(false);

     // state for capturing adjustedMonthlypayment function
     const [recordPaymentState, setRecordPaymentState] = useState({GUID: props.loan.GUID});

     // state to keep track of the current monthly payment and user selected range for slider / currency input functionality
     const [rangeValueState, setRangeValueState] = useState(Number(props.loan.MonthlyPayment));


     // functions to show or hide the record payment modal
     const showAdjustMonthlyPaymentFunc = () => setAdjustMonthlyPaymentState(true);
     const hideAdjustMonthlyPaymentFunc = () => {
          // clear the state 
          setRecordPaymentState({
               GUID: props.loan.GUID
          });

          // clear the value state
          setRangeValueState(
               Number(props.loan.MonthlyPayment)
          );
          // hide the modal
          setAdjustMonthlyPaymentState(false);
     }


     useEffect(() => {
          console.log(rangeValueState);
     }, [rangeValueState])
     


     return(
          <>
               <Button variant="success" size="lg"
               onClick={showAdjustMonthlyPaymentFunc}>
                    Adjust Monthly Payment
               </Button>


               <Modal
                    show={showAdjustMonthlyPaymentState}
                    onHide={hideAdjustMonthlyPaymentFunc}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Adjust your Monthly Payment</Modal.Title>
                    </Modal.Header>


                    <Modal.Body>
                         <h3>Description bitch</h3>

                         <Form.Group className="mb-3 loanItemViewRangeSlider">

                              <div className="rangeSelectorFull">
                                   {/* darn floating point numbers expressed in binary */}
                                   <h1>{rangeValueState ==  parseFloat(props.loan.MonthlyPayment) || isNaN(rangeValueState) ? "---" : "$" + ((rangeValueState*100) - (parseFloat(props.loan.MonthlyPayment)*100))/100}</h1>
                                   <span className="text-muted">more per month</span>
                              </div>

                              <div className="rangeSelectorSmall">
                                   <h2>${parseFloat(props.loan.MonthlyPayment)}</h2>
                                   <Form.Label>Minimum Montly Payment</Form.Label>
                              </div>

                              <div className="rangeSelectorLarge">
                                   <Form.Range
                                   min={parseFloat(props.loan.MonthlyPayment)}
                                   max={5 * parseFloat(props.loan.MonthlyPayment)}
                                   value={rangeValueState}
                                   onChange={e => setRangeValueState(e.target.value)}
                                   />
                              </div>

                              <div className="rangeSelectorSmall">
                                   <h2>{rangeValueState ==  parseFloat(props.loan.MonthlyPayment) || isNaN(rangeValueState) ? "---" : "$" + rangeValueState}</h2>
                                   <Form.Label>New Montly Payment</Form.Label>
                              </div>

                              <div className="rangeSelectorFull">
                                   <div className="rangeSelectorInputHolder">
                                        <Form.Label>Alternatively, you may enter a desired number</Form.Label>
                                        <CurrencyInput
                                        prefix="$"
                                        name="desiredMonthlyPayment"
                                        placeholder="or, enter a value"
                                        decimalScale={2}
                                        decimalsLimit={2}
                                        value={rangeValueState}
                                        onValueChange={(value) => setRangeValueState(Number(value))}
                                        />
                                   </div>
                              </div>

                              <div className="rangeSelectorFull">
                                   <Button variant="success" size="lg" onClick={() => hidePaymentModalFunc()}>
                                        Calculate
                                   </Button>
                              </div>

                         </Form.Group>

                         <div>
                              <p>
                              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                              </p>
                         </div>

                    </Modal.Body>




                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={() => hideAdjustMonthlyPaymentFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitAdjustedMonthlyPayment()}>
                              Record
                         </Button>
                    </Modal.Footer>

               </Modal>
          </>
     );
}