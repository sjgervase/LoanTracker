import React, { useEffect, useState } from "react";

import CurrencyInput from "react-currency-input-field";

import { Button, Form, Modal, Table } from "react-bootstrap";

import { BigNumber } from "bignumber.js"

import { ipcRenderer } from "electron";







export default function AddMonthlyBillModal() {

     // state for showing or hiding the modal
     const [showAddMonthlyBill, setShowAddMonthlyBill] = useState(false);


     // state to keep track of user entered data
     const [monthlyBillState, setMonthlyBillState] = useState({});



     // functions to show or hide the modal
     const showAddMonthlyBillFunc = () => {setShowAddMonthlyBill(true)};
     
     
     const hideAddMonthlyBillFunc = () => {
          // clear the value state
          setMonthlyBillState({});
          // hide the modal
          setShowAddMonthlyBill(false);
     }

     // function to handle form item updates
     const handleChange = (value, name) => {
          setMonthlyBillState({ ...monthlyBillState, [name]: value })
     }


     

     // function to submit entered data from "adjust monthly payment modal"
     function submitMonthlyBill() {
          // get the calculated monthly bill
          let calculatedMonthlyBill = monthlyBillCalculator();

          // create an income object with the state and calculated monthly bill
          let billObject = {
               ...monthlyBillState,
               MonthlyBill: calculatedMonthlyBill
          }

          ipcRenderer.invoke('submitMonthlyBill', (billObject));

          // clear the value state
          setMonthlyBillState({});
          // hide the modal
          setShowAddMonthlyBill(false);
     }



     // function to show estimated monthly payment
     function monthlyBillCalculator() {
          // create empty var to be populated
          let monthlybill;

          // ensure both fields are selected
          if (monthlyBillState.hasOwnProperty("BillFrequency") && monthlyBillState.hasOwnProperty("BillAmount")) {
               
               let bill = new BigNumber(monthlyBillState.BillAmount);

               switch (monthlyBillState.BillFrequency) {
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
     

     


     return(
          <>
               <Button variant="outline-danger"
               onClick={showAddMonthlyBillFunc}>
                    Add Monthly Bill
               </Button>

               <Modal
                    show={showAddMonthlyBill}
                    onHide={hideAddMonthlyBillFunc}
                    backdrop="static"
                    keyboard={false}
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Add a Recurring bill</Modal.Title>
                    </Modal.Header>


                    <Modal.Body>
                         <p>Add a recurring bill to keep track of your total average expenses throughout the month</p>

                         <Form.Group controlId="BillName">
                              <Form.Label>Income Name</Form.Label>
                              <Form.Control type="Text" name="BillName" placeholder="Rent" 
                              onChange={e => handleChange(e.target.value, e.target.name)} />
                              <Form.Text className="text-muted">You can name it whatever you'd like. This is just for you to keep track of it</Form.Text>
                         </Form.Group>


                         <Form.Group className="mb-3">
                              <Form.Label>Select a Bill Frequency. This is how often a bill is recieved</Form.Label>
                              <Form.Select  name="BillFrequency" onChange={e => handleChange(e.target.value, e.target.name)} >
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
                                   name="BillAmount"
                                   placeholder="ex $200"
                                   decimalScale={2}
                                   decimalsLimit={2}
                                   allowNegativeValue={false}
                                   onValueChange={(value, name) => handleChange(value, name)}
                              />
                         </Form.Group>

                         <div className="monthlyBillDiv">
                              <span>Your bill is approximately</span>
                              <h2>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(monthlyBillCalculator())}</h2>
                              <span>per month</span>
                         </div>

                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={() => hideAddMonthlyBillFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitMonthlyBill()}
                         disabled={!(monthlyBillState.hasOwnProperty("BillName")) || !(monthlyBillState.hasOwnProperty("BillFrequency")) || !(monthlyBillState.hasOwnProperty("BillAmount")) ? true : false}>
                              Record
                         </Button>
                    </Modal.Footer>

               </Modal>
          </>
     );
}