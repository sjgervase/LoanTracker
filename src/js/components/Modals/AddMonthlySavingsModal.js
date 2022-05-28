import React, { useEffect, useState } from "react";

import CurrencyInput from "react-currency-input-field";

import { Button, Form, Modal, Table, Popover, Overlay, OverlayTrigger } from "react-bootstrap";

import { BigNumber } from "bignumber.js"

import { ipcRenderer } from "electron";







export default function AddMonthlySavingsModal() {

     // state for showing or hiding the modal
     const [showModal, setShowModal] = useState(false);

     // state to keep track of user entered data
     const [monthlySavingsState, setMonthlySavingsState] = useState({});

     // functions to show or hide the modal
     const showModalFunc = () => {setShowModal(true)};
     
     const hideAddMonthlySavingsFunc = () => {
          // clear the value state
          setMonthlySavingsState({});
          // hide the modal
          setShowModal(false);
     }

     // function to handle form item updates
     const handleChange = (value, name) => {
          setMonthlySavingsState({ ...monthlySavingsState, [name]: value })
     }

     // function to submit entered data from "adjust monthly savingsment modal"
     function submitMonthlySavings() {
          // get the calculated monthly savings
          let calculatedMonthlySavings = monthlySavingsCalculator();

          // create an savings object with the state and calculated monthly savings
          let savingsObject = {
               ...monthlySavingsState,
               Type:"savings",
               MonthlySavings: calculatedMonthlySavings,
          }

          ipcRenderer.invoke('submitMonthlydeduction', (savingsObject));

          // clear the value state
          setMonthlySavingsState({});

          // hide the modal
          setShowModal(false);
     }

     // function to show estimated monthly savingsment
     function monthlySavingsCalculator() {
          // create empty var to be populated
          let monthlysavings;

          // ensure both fields are selected
          if (monthlySavingsState.hasOwnProperty("SavingsFrequency") && monthlySavingsState.hasOwnProperty("SavingsmentAmount")) {
               
               let savings = new BigNumber(monthlySavingsState.SavingsmentAmount);

               switch (monthlySavingsState.SavingsFrequency) {
                    case "Weekly":
                         monthlysavings = savings.multipliedBy(52).dividedBy(12).toFixed(2);
                    break;

                    case "Every 2 Weeks":
                         monthlysavings = savings.multipliedBy(26).dividedBy(12).toFixed(2);
                    break;    
               
                    case "Twice per Month":
                         monthlysavings = savings.multipliedBy(2).toFixed(2);
                    break;    

                    case "Monthly":
                         monthlysavings = savings.toFixed(2);
                    break;

                    case "Quarterly":
                         monthlysavings = savings.multipliedBy(4).dividedBy(12).toFixed(2);
               }

               return monthlysavings;
          } else {
               return 0;
          }
     }
     
     const popover = (
          <Popover id="popover-basic">
               <Popover.Header as="h3">Add Monthly Savings</Popover.Header>
               
               <Popover.Body>
                    Regularly saving money is an important step on the road to financial freedom. But ensuring regular saving decreases your total disposable income and thus should be reduced from your monthly net.
                    <br></br>
                    Some Examples:
                    <br></br>
                    <ul>
                         <li>A consistent portion of your paycheck going into a savings account</li>
                         <li>Semi-regular transfers to a savings account</li>
                         <li>Dividends that go directly to savings</li>
                    </ul>
               </Popover.Body>
          </Popover>
     );

     return(
          <>
               <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={popover}>
                    <Button variant="success" size="lg" className="btn-AddMonthlySavings"
                    onClick={showModalFunc}>
                         Add Monthly Savings
                    </Button>
               </OverlayTrigger>
               

               <Modal
                    show={showModal}
                    onHide={hideAddMonthlySavingsFunc}
                    backdrop="static"
                    keyboard={false}
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Add a Recurring Savings</Modal.Title>
                    </Modal.Header>


                    <Modal.Body>
                         <p className="lead">Add any amounts that you contribute to your savings, as this is removed from your amount of disposable income.</p>

                         <Form.Group controlId="SavingsName">
                              <Form.Label>Savings Name</Form.Label>
                              <Form.Control type="Text" name="SavingsName" placeholder="Savings Account" 
                              onChange={e => handleChange(e.target.value, e.target.name)} />
                              <Form.Text className="text-muted">You can name it whatever you'd like. This is just for you to keep track of it</Form.Text>
                         </Form.Group>


                         <Form.Group className="mb-3">
                              <Form.Label>Select a Savings Frequency. This is how often a savingscheck is recieved</Form.Label>
                              <Form.Select  name="SavingsFrequency" onChange={e => handleChange(e.target.value, e.target.name)} >
                                   <option>⎯⎯⎯⎯⎯</option>
                                   <option>Weekly</option>
                                   <option>Every 2 Weeks</option>
                                   <option>Twice per Month</option>
                                   <option>Monthly</option>
                                   <option>Quarterly</option>
                              </Form.Select>
                         </Form.Group>

                         <Form.Group>
                              <Form.Label>Enter an amount. If you recieve irregular amounts (from tips or inconsistent hours), enter an average</Form.Label>
                              <CurrencyInput
                                   prefix="$"
                                   name="SavingsmentAmount"
                                   placeholder="ex $200"
                                   decimalScale={2}
                                   decimalsLimit={2}
                                   allowNegativeValue={false}
                                   onValueChange={(value, name) => handleChange(value, name)}
                              />
                         </Form.Group>

                         <div className="monthlySavingsDiv">
                              <span>You savings is approximately</span>
                              <h2>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(monthlySavingsCalculator())}</h2>
                              <span>per month</span>
                         </div>
                         
                    </Modal.Body>




                    <Modal.Footer>
                         <Button variant="outline-success" onClick={() => hideAddMonthlySavingsFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitMonthlySavings()}
                         disabled={!(monthlySavingsState.hasOwnProperty("SavingsName")) || !(monthlySavingsState.hasOwnProperty("SavingsFrequency")) || !(monthlySavingsState.hasOwnProperty("SavingsmentAmount")) ? true : false}>
                              Record
                         </Button>
                    </Modal.Footer>

               </Modal>
          </>
     );
}