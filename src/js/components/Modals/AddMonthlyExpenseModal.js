import React, { useEffect, useState } from "react";

import CurrencyInput from "react-currency-input-field";

import { Button, Form, Modal, Table, Popover, Overlay, OverlayTrigger } from "react-bootstrap";

import { BigNumber } from "bignumber.js"

import { ipcRenderer } from "electron";







export default function AddMonthlyExpenseModal() {

     // state for showing or hiding the modal
     const [showModal, setShowModal] = useState(false);


     // state to keep track of user entered data
     const [monthlyExpenseState, setMonthlyExpenseState] = useState({});



     // functions to show or hide the modal
     const showModalFunc = () => {setShowModal(true)};
     
     
     const hideAddMonthlyExpenseFunc = () => {
          // clear the value state
          setMonthlyExpenseState({});
          // hide the modal
          setShowModal(false);
     }

     // function to handle form item updates
     const handleChange = (value, name) => {
          setMonthlyExpenseState({ ...monthlyExpenseState, [name]: value })
     }


     

     // function to submit entered data from "adjust monthly payment modal"
     function submitMonthlyExpense() {
          // get the calculated monthly Expense
          let calculatedMonthlyExpense = monthlyExpenseCalculator();

          // create an expense object with the state and calculated monthly expense
          let expenseObject = {
               ...monthlyExpenseState,
               Type: "expense",
               MonthlyExpense: calculatedMonthlyExpense
          }

          // invoke the same as bills with an additional field. these are treated very similarly to the database
          ipcRenderer.invoke('submitMonthlydeduction', (expenseObject));

          // clear the value state
          setMonthlyExpenseState({});
          // hide the modal
          setShowModal(false);
     }



     // function to show estimated monthly payment
     function monthlyExpenseCalculator() {
          // create empty var to be populated
          let monthlyexpense;

          // ensure both fields are selected
          if (monthlyExpenseState.hasOwnProperty("ExpenseFrequency") && monthlyExpenseState.hasOwnProperty("ExpenseAmount")) {
               
               let expense = new BigNumber(monthlyExpenseState.ExpenseAmount);

               switch (monthlyExpenseState.ExpenseFrequency) {
                    case "Daily":
                         monthlyexpense = expense.multipliedBy(365).dividedBy(12).toFixed(2);
                    break;

                    case "Daily (excluding weekends)":
                         monthlyexpense = expense.multipliedBy(5).multipliedBy(52).dividedBy(12).toFixed(2);
                    break;

                    case "Weekends":
                         monthlyexpense = expense.multipliedBy(52).dividedBy(12).toFixed(2);
                    break;

                    case "Weekly":
                         monthlyexpense = expense.multipliedBy(52).dividedBy(12).toFixed(2);
                    break;

                    case "Monthly":
                         monthlyexpense = expense.toFixed(2);
                    break;
               }

               return monthlyexpense;
          } else {
               return 0;
          }
     }
     

     
     const popover = (
          <Popover id="popover-basic">
               <Popover.Header as="h3">Add Monthly Expense</Popover.Header>
               
               <Popover.Body>
                    Add any sort of regular expenses incurred to be incorporated into your monthly budget. These can be tough to get accurate, but estimating will ensure your monthly budget is as realistic as possible.
                    <br></br>
                    Some Examples:
                    <ul>
                         <li>Daily Coffee</li>
                         <li>Groceries</li>
                         <li>Gas for a vehicle</li>
                         <li>Restaurants on weekends</li>
                    </ul>
               </Popover.Body>
          </Popover>
     );

     return(
          <>
               <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={popover}>
                    <Button variant="danger" size="lg" className="btn-AddMonthlyExpense"
                    onClick={showModalFunc}>
                         Add Monthly Expense
                    </Button>     
               </OverlayTrigger>
               

               <Modal
                    show={showModal}
                    onHide={hideAddMonthlyExpenseFunc}
                    backdrop="static"
                    keyboard={false}
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Add a Recurring expense</Modal.Title>
                    </Modal.Header>


                    <Modal.Body>
                         <p>Add a recurring expense to keep track of your total average expenses throughout the month</p>

                         <Form.Group controlId="ExpenseName">
                              <Form.Label>Expense Name</Form.Label>
                              <Form.Control type="Text" name="ExpenseName" placeholder="Groceries" 
                              onChange={e => handleChange(e.target.value, e.target.name)} />
                              <Form.Text className="text-muted">You can name it whatever you'd like. This is just for you to keep track of it</Form.Text>
                         </Form.Group>


                         <Form.Group className="mb-3">
                              <Form.Label>Select a Expense Frequency. This is how often a expense is recieved</Form.Label>
                              <Form.Select  name="ExpenseFrequency" onChange={e => handleChange(e.target.value, e.target.name)} >
                                   <option>⎯⎯⎯⎯⎯</option>
                                   <option>Daily</option>
                                   <option>Daily (excluding weekends)</option>
                                   <option>Weekends</option>
                                   <option>Weekly</option>
                                   <option>Monthly</option>
                              </Form.Select>
                         </Form.Group>

                         <Form.Group>
                              <Form.Label>Enter an amount. For inconsistent expenses such as groceries or coffee shop purchases, try and enter an average amount</Form.Label>
                              <CurrencyInput
                                   prefix="$"
                                   name="ExpenseAmount"
                                   placeholder="ex $200"
                                   decimalScale={2}
                                   decimalsLimit={2}
                                   allowNegativeValue={false}
                                   onValueChange={(value, name) => handleChange(value, name)}
                              />
                         </Form.Group>

                         <div className="monthlyExpenseDiv">
                              <span>Your expense is approximately</span>
                              <h2>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(monthlyExpenseCalculator())}</h2>
                              <span>per month</span>
                         </div>

                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={() => hideAddMonthlyExpenseFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitMonthlyExpense()}
                         disabled={!(monthlyExpenseState.hasOwnProperty("ExpenseName")) || !(monthlyExpenseState.hasOwnProperty("ExpenseFrequency")) || !(monthlyExpenseState.hasOwnProperty("ExpenseAmount")) ? true : false}>
                              Record
                         </Button>
                    </Modal.Footer>

               </Modal>
          </>
     );
}