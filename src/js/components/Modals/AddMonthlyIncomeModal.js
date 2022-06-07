import React, { useEffect, useState } from "react";

import CurrencyInput from "react-currency-input-field";

import { Button, Form, Modal, Table, Popover, Overlay, OverlayTrigger } from "react-bootstrap";

import { BigNumber } from "bignumber.js"

import { ipcRenderer } from "electron";


// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import store actions
import { addIncome } from "../../Redux/features/IncomesSlice";





export default function AddMonthlyIncomeModal() {

     const dispatch = useDispatch();

     // get data from redux store
     const incomesState = useSelector((state) => state.incomes);

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     // state for showing or hiding the modal
     const [showModal, setShowModal] = useState(false);

     // state to keep track of user entered data
     const [monthlyPayState, setMonthlyPayState] = useState({});

     // functions to show or hide the modal
     const showModalFunc = () => {setShowModal(true)};
     
     const hideAddMonthlyPayFunc = () => {
          // clear the value state
          setMonthlyPayState({});
          // hide the modal
          setShowModal(false);
     }

     // function to handle form item updates
     const handleChange = (value, name) => {
          setMonthlyPayState({ ...monthlyPayState, [name]: value })
     }

     

     // read and generate unique GUIDS
     function guidGenerator() {
          
          // create empty array to be populated by all guids currently in the file
          let guidArray = [];

          // for each loan item
          for (let i = 0; i < incomesState.incomes.length; i++) {
               guidArray.push(incomesState.incomes[i].GUID);
          }

          // generate 20 digit GUID for album and album art
          let randomGUID = (length = 20) => {
               let str = "";
               // create a GUID within a while loop. this will loop infinitely until a GUID is not already being used
               while (true) {
                    // Declare all characters
                    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                    // Pick characers randomly and add them to "str" variable to create random string
                    for (let i = 0; i < length; i++) {
                         str += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    // if str is not being used as a GUID already, break the while loop
                    if (!(guidArray.includes(str))) {
                         break;
                    }
               }
               return str;
          };
          return randomGUID();
     }



     // function to show estimated monthly payment
     function monthlyPayCalculator() {
          // create empty var to be populated
          let monthlypay;

          // ensure both fields are selected
          if (monthlyPayState.hasOwnProperty("Frequency") && monthlyPayState.hasOwnProperty("Amount")) {
               
               let pay = new BigNumber(monthlyPayState.Amount);

               switch (monthlyPayState.Frequency) {
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


     const popover = (
          <Popover id="popover-basic" className="customPopover">
               <Popover.Header as="h3" className="customPopoverHeader">Add Monthly Income</Popover.Header>
               
               <Popover.Body className="customPopoverBody">
                    Add any sort of regular income you recieve to be incorporated into your monthly budget.
                    <br></br>
                    Some Examples:
                    <br></br>
                    <ul>
                         <li>Regular Paychecks</li>
                         <li>Passive Income</li>
                         <li>Dividends</li>
                    </ul>
               </Popover.Body>
          </Popover>
     );


     // function to submit entered data from "adjust monthly payment modal"
     function submitMonthlyPay() {
          // get the calculated monthly pay
          let calculatedMonthlyPay = monthlyPayCalculator();

          // get a GUID for this item
          let newGUID = guidGenerator();

          // create an income object with the state and calculated monthly pay
          let incomeObject = {
               ...monthlyPayState,
               MonthlyAmount: calculatedMonthlyPay,
               GUID: newGUID
          }

          // dispatch action to the reducer
          dispatch(addIncome(incomeObject));

          // clear the value state so the user can instantly add another income
          setMonthlyPayState({});

          // hide the modal
          setShowModal(false);
     }
     


     return(
          <>
               <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={popover}>
                    <Button variant="success" size="lg" className="btn-AddMonthlyIncome"
                    onClick={showModalFunc}>
                         Add Monthly Income
                    </Button>
               </OverlayTrigger>

               
                         
                    

               <Modal
                    show={showModal}
                    onHide={hideAddMonthlyPayFunc}
                    backdrop="static"
                    keyboard={false}
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Add a Recurring Income</Modal.Title>
                    </Modal.Header>


                    <Modal.Body>
                         <p className="lead">Add your income sources and amounts to be stored for budgeting calculations</p>

                         <Form.Group controlId="Name">
                              <Form.Label>Income Name</Form.Label>
                              <Form.Control type="Text" name="Name" placeholder="Paycheck" 
                              onChange={e => handleChange(e.target.value, e.target.name)} />
                              <Form.Text className="text-muted">You can name it whatever you'd like. This is just for you to keep track of it</Form.Text>
                         </Form.Group>


                         <Form.Group className="mb-3">
                              <Form.Label>Select a Pay Frequency. This is how often a paycheck is recieved</Form.Label>
                              <Form.Select  name="Frequency" onChange={e => handleChange(e.target.value, e.target.name)} >
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
                                   name="Amount"
                                   placeholder="ex $200"
                                   decimalScale={2}
                                   decimalsLimit={2}
                                   allowNegativeValue={false}
                                   onValueChange={(value, name) => handleChange(value, name)}
                              />
                         </Form.Group>

                         <div className="monthlyTotalDiv">
                              <span>You income is approximately</span>
                              <h2>{moneyFormatter(monthlyPayCalculator())}</h2>
                              <span>per month</span>
                         </div>
                         
                    </Modal.Body>




                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={() => hideAddMonthlyPayFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitMonthlyPay()}
                         disabled={!(monthlyPayState.hasOwnProperty("Name")) || !(monthlyPayState.hasOwnProperty("Frequency")) || !(monthlyPayState.hasOwnProperty("Amount")) ? true : false}>
                              Record
                         </Button>
                    </Modal.Footer>

               </Modal>
          </>
     );
}