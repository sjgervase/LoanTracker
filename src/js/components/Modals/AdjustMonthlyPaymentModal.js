import React, { useEffect, useState } from "react";

import CurrencyInput from "react-currency-input-field";


import { Button, Form, Modal } from "react-bootstrap";







export default function AdjustMonthlyPaymentModal(props) {
     // console.log(props);

     // state for showing or hiding the modal
     const [showAdjustMonthlyPaymentState, setAdjustMonthlyPaymentState] = useState(false);

     // state for capturing adjustedMonthlypayment function
     const [recordPaymentState, setRecordPaymentState] = useState({GUID: props.loan?.loan?.GUID});

     // state to keep track of the current monthly payment and user selected range for slider / currency input functionality
     const [rangeValueState, setRangeValueState] = useState();


     // functions to show or hide the record payment modal
     const showAdjustMonthlyPaymentFunc = () => {
          
          setAdjustMonthlyPaymentState(true)

          // set the range value on open
          setRangeValueState(
               Number(props.loan?.loan.MonthlyPayment)
          )
     };
     
     
     const hideAdjustMonthlyPaymentFunc = () => {
          // clear the state 
          setRecordPaymentState({
               GUID: props.loan?.loan?.GUID
          });

          // clear the value state
          setRangeValueState(
               Number(props.loan?.loan?.MonthlyPayment)
          );
          // hide the modal
          setAdjustMonthlyPaymentState(false);
     }


     // useEffect(() => {
     //      console.log(rangeValueState);
     // }, [rangeValueState])
     


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
                         <p className="lead">Paying more than the minimum required amount can allow you to pay off loans quicker AND pay less overall interest</p>

                         <Form.Group className="mb-3 loanItemViewRangeSlider">

                              <div className="rangeSelectorFull">
                                   {/* darn floating point numbers expressed in binary */}
                                   <h1>{rangeValueState ==  parseFloat(props.loan?.loan?.MonthlyPayment) || isNaN(rangeValueState) ? "---" : "$" + ((rangeValueState*100) - (parseFloat(props.loan.loan.MonthlyPayment)*100))/100}</h1>
                                   <span className="text-muted">more per month</span>
                              </div>

                              <div className="rangeSelectorSmall">
                                   <h3>${parseFloat(props.loan?.loan?.MonthlyPayment)}</h3>
                                   <Form.Label>Minimum Montly Payment</Form.Label>
                              </div>

                              <div className="rangeSelectorLarge">
                                   <Form.Range
                                   min={parseFloat(props.loan?.loan?.MonthlyPayment)}
                                   max={5 * parseFloat(props.loan?.loan?.MonthlyPayment)}
                                   value={rangeValueState}
                                   onChange={e => setRangeValueState(e.target.value)}
                                   />
                              </div>

                              <div className="rangeSelectorSmall">
                                   <h3>{rangeValueState ==  parseFloat(props.loan?.loan?.MonthlyPayment) || isNaN(rangeValueState) ? "---" : "$" + rangeValueState}</h3>
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
                                        maxLength={8}
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

                         <div className="adjustedPaymentResult">
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