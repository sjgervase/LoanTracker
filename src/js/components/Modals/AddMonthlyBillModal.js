import React, { useEffect, useState } from "react";

import CurrencyInput from "react-currency-input-field";

import { Button, Form, Modal, Table, Popover, Overlay, OverlayTrigger } from "react-bootstrap";

import { BigNumber } from "bignumber.js"

import { ipcRenderer } from "electron";







export default function AddMonthlyExpenseModal() {

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     // state for showing or hiding the modal
     const [showModal, setShowModal] = useState(false);


     // state to keep track of user entered data
     const [monthlyBillState, setMonthlyBillState] = useState({});



     // functions to show or hide the modal
     const showModalFunc = () => {setShowModal(true)};
     
     
     const hideAddMonthlyBillFunc = () => {
          // clear the value state
          setMonthlyBillState({});
          // hide the modal
          setShowModal(false);
     }

     // function to handle form item updates
     const handleChange = (value, name) => {
          setMonthlyBillState({ ...monthlyBillState, [name]: value })
     }


     

     // function to submit entered data from "adjust monthly payment modal"
     function submitMonthlyBill() {
          // get the calculated monthly bill
          let calculatedMonthlyBill = monthlyBillCalculator();

          // create an bill object with the state and calculated monthly bill
          let billObject = {
               ...monthlyBillState,
               Type: "bill",
               MonthlyAmount: calculatedMonthlyBill
          }

          ipcRenderer.invoke('submitMonthlydeduction', (billObject));

          // clear the value state
          setMonthlyBillState({});
          // hide the modal
          setShowModal(false);
     }



     // function to show estimated monthly payment
     function monthlyBillCalculator() {
          // create empty var to be populated
          let monthlybill;

          // ensure both fields are selected
          if (monthlyBillState.hasOwnProperty("Frequency") && monthlyBillState.hasOwnProperty("Amount")) {
               
               let bill = new BigNumber(monthlyBillState.Amount);

               switch (monthlyBillState.Frequency) {
                    case "Weekly":
                         monthlybill = bill.multipliedBy(52).dividedBy(12).toFixed(2);
                    break;

                    case "Monthly":
                         monthlybill = bill.toFixed(2);
                    break;
               
                    case "Quarterly":
                         monthlybill = bill.multipliedBy(4).dividedBy(12).toFixed(2);
                    break;
                    
                    case "Twice per Year":
                         monthlybill = bill.multipliedBy(2).dividedBy(12).toFixed(2);
                    break;

                    case "Yearly":
                         monthlybill = bill.dividedBy(12).toFixed(2);
                    break;
               }

               return monthlybill;
          } else {
               return 0;
          }
     }
     

     const popover = (
          <Popover id="popover-basic">
               <Popover.Header as="h3">Add Monthly Bill</Popover.Header>
               
               <Popover.Body>
                    Add any sort of regular bills you recieve to be incorporated into your monthly budget. While very similar to expenses, these tend to be more consistent in amount and are paid at regular intervals.
                    <br></br>
                    Some Examples:
                    <br></br>
                    <ul>
                         <li>Rent</li>
                         <li>Utilities</li>
                         <li>Mobile Phone Plan</li>
                         <li>Streaming Service Plan</li>
                         <li>Car Insurance</li>
                    </ul>
               </Popover.Body>
          </Popover>
     );


     return(
          <>
               <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={popover}>
                    <Button variant="danger" size="lg" className="btn-AddMonthlyBill"
                    onClick={showModalFunc}>
                         Add Monthly Bill
                    </Button>
               </OverlayTrigger>

               <Modal
                    show={showModal}
                    onHide={hideAddMonthlyBillFunc}
                    backdrop="static"
                    keyboard={false}
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Add a Recurring bill</Modal.Title>
                    </Modal.Header>


                    <Modal.Body>
                         <p>Add a recurring bill to keep track of your total average expenses throughout the month</p>

                         <Form.Group controlId="Name">
                              <Form.Label>Bill Name</Form.Label>
                              <Form.Control type="Text" name="Name" placeholder="Rent" 
                              onChange={e => handleChange(e.target.value, e.target.name)} />
                              <Form.Text className="text-muted">You can name it whatever you'd like. This is just for you to keep track of it</Form.Text>
                         </Form.Group>


                         <Form.Group className="mb-3">
                              <Form.Label>Select a Bill Frequency. This is how often a bill is recieved</Form.Label>
                              <Form.Select  name="Frequency" onChange={e => handleChange(e.target.value, e.target.name)} >
                                   <option>⎯⎯⎯⎯⎯</option>
                                   <option>Weekly</option>
                                   <option>Monthly</option>
                                   <option>Quarterly</option>
                                   <option>Twice per Year</option>
                                   <option>Yearly</option>
                              </Form.Select>
                         </Form.Group>

                         <Form.Group>
                              <Form.Label>Enter an amount. For inconsistent bills such as gas and electricity, try and enter an average amount</Form.Label>
                              <CurrencyInput
                                   prefix="$"
                                   name="Amount"
                                   placeholder="ex $200"
                                   decimalScale={2}
                                   decimalsLimit={2}
                                   allowNegativeValue={false}
                                   onValueChange={(value, name) => handleChange(value, name)}
                              />
                         </Form.Group>

                         <div className="monthlyTotalDiv">
                              <span>Your bill is approximately</span>
                              <h2>{moneyFormatter(monthlyBillCalculator())}</h2>
                              <span>per month</span>
                         </div>

                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={() => hideAddMonthlyBillFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitMonthlyBill()}
                         disabled={!(monthlyBillState.hasOwnProperty("Name")) || !(monthlyBillState.hasOwnProperty("Frequency")) || !(monthlyBillState.hasOwnProperty("Amount")) ? true : false}>
                              Record
                         </Button>
                    </Modal.Footer>

               </Modal>
          </>
     );
}