import React, { useEffect, useState } from "react";

import CurrencyInput from "react-currency-input-field";

import { Button, Form, Modal, Table } from "react-bootstrap";

import { BigNumber } from "bignumber.js"

import { ipcRenderer } from "electron";







export default function AddMonthlyPayModal() {

     // state for showing or hiding the modal
     const [showAddMonthlyPay, setShowAddMonthlyPay] = useState(false);

     // state to keep track of user entered data
     const [monthlyPayState, setMonthlyPayState] = useState({});

     // functions to show or hide the modal
     const showAddMonthlyPayFunc = () => {setShowAddMonthlyPay(true)};
     
     const hideAddMonthlyPayFunc = () => {
          // clear the value state
          setMonthlyPayState({});
          // hide the modal
          setShowAddMonthlyPay(false);
     }

     // function to handle form item updates
     const handleChange = (value, name) => {
          setMonthlyPayState({ ...monthlyPayState, [name]: value })
     }

     // function to submit entered data from "adjust monthly payment modal"
     function submitMonthlyPay() {
          // get the calculated monthly pay
          let calculatedMonthlyPay = monthlyPayCalculator();

          // create an income object with the state and calculated monthly pay
          let incomeObject = {
               ...monthlyPayState,
               MonthlyPay: calculatedMonthlyPay,
          }

          ipcRenderer.invoke('submitMonthlyPay', (incomeObject));

          // clear the value state
          setMonthlyPayState({});

          // hide the modal
          setShowAddMonthlyPay(false);
     }

     // function to show estimated monthly payment
     function monthlyPayCalculator() {
          // create empty var to be populated
          let monthlypay;

          // ensure both fields are selected
          if (monthlyPayState.hasOwnProperty("PayFrequency") && monthlyPayState.hasOwnProperty("PaymentAmount")) {
               
               let pay = new BigNumber(monthlyPayState.PaymentAmount);

               switch (monthlyPayState.PayFrequency) {
                    case "Weekly":
                         monthlypay = pay.multipliedBy(52).dividedBy(12).toFixed(2);
                    break;

                    case "Every 2 Weeks":
                         monthlypay = pay.multipliedBy(26).dividedBy(12).toFixed(2);
                    break;    
               
                    case "Twice per Month":
                         monthlypay = pay.multipliedBy(2).toFixed(2);
                    break;    

                    case "Monthly":
                         monthlypay = pay.toFixed(2);
                    break;

                    case "Quarterly":
                         monthlypay = pay.multipliedBy(4).dividedBy(12).toFixed(2);
               }

               return monthlypay;
          } else {
               return 0;
          }
     }
     


     return(
          <>
               <Button variant="success"
               onClick={showAddMonthlyPayFunc}>
                    Add Monthly Pay
               </Button>

               <Modal
                    show={showAddMonthlyPay}
                    onHide={hideAddMonthlyPayFunc}
                    backdrop="static"
                    keyboard={false}
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Add a Recurring Income</Modal.Title>
                    </Modal.Header>


                    <Modal.Body>
                         <p className="lead">Add your income sources and amounts to be stored for budgeting calculations</p>

                         <Form.Group controlId="IncomeName">
                              <Form.Label>Income Name</Form.Label>
                              <Form.Control type="Text" name="IncomeName" placeholder="Paycheck" 
                              onChange={e => handleChange(e.target.value, e.target.name)} />
                              <Form.Text className="text-muted">You can name it whatever you'd like. This is just for you to keep track of it</Form.Text>
                         </Form.Group>


                         <Form.Group className="mb-3">
                              <Form.Label>Select a Pay Frequency. This is how often a paycheck is recieved</Form.Label>
                              <Form.Select  name="PayFrequency" onChange={e => handleChange(e.target.value, e.target.name)} >
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
                                   name="PaymentAmount"
                                   placeholder="ex $200"
                                   decimalScale={2}
                                   decimalsLimit={2}
                                   allowNegativeValue={false}
                                   onValueChange={(value, name) => handleChange(value, name)}
                              />
                         </Form.Group>

                         <div className="monthlyPayDiv">
                              <span>You make approximately</span>
                              <h2>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(monthlyPayCalculator())}</h2>
                              <span>per month</span>
                         </div>
                         
                    </Modal.Body>




                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={() => hideAddMonthlyPayFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitMonthlyPay()}
                         disabled={!(monthlyPayState.hasOwnProperty("IncomeName")) || !(monthlyPayState.hasOwnProperty("PayFrequency")) || !(monthlyPayState.hasOwnProperty("PaymentAmount")) ? true : false}>
                              Record
                         </Button>
                    </Modal.Footer>

               </Modal>
          </>
     );
}