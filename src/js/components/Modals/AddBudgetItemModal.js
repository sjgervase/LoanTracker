import React, { useEffect, useState } from "react";

import CurrencyInput from "react-currency-input-field";

import { Button, Form, Modal, Table, Popover, Overlay, OverlayTrigger, Row, Col } from "react-bootstrap";

import { BigNumber } from "bignumber.js"

import { ipcRenderer } from "electron";


// import store actions
import { addDeduction } from "../../Redux/features/DeductionsSlice";
import { addIncome } from "../../Redux/features/IncomesSlice";

import { useSelector, useDispatch } from "react-redux";


export default function AddBudgetItemModal(props) {

     const dispatch = useDispatch();

     // get data from redux store
     const deductionsState = useSelector((state) => state.deductions);
     const incomesState = useSelector((state) => state.incomes);

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     // state for showing or hiding the modal
     const [showModal, setShowModal] = useState(false);


     // state to hold the specific properties for each variant of the modal
     const [itemPropertiesState, setItemPropertiesState] = useState({
          title: '',
          modalText: '',
          namePlaceholder: '',
          frequencyText: '',
          buttonClass: '',
          buttonVariant: '',
          popover: '',
          dropdownOptions: ''
     })

     // useEffect to set state based on type from prop
     useEffect(() => {

          switch (props.type) {
               case 'income':
                    setItemPropertiesState({
                         title: "Income",
                         modalText: 'Add your income sources and amounts to be stored for budgeting calculations',
                         namePlaceholder: 'Paycheck',
                         frequencyText: 'Enter an amount. If you recieve irregular amounts (from tips or inconsistent hours), enter an average',
                         buttonClass: 'btn-AddMonthlyIncome',
                         buttonVariant: 'success',
                         popover: incomePopover,
                         dropdownOptions: incomeDropDown
                    })
               break;


               case 'bill':
                    setItemPropertiesState({
                         title: "Bill",
                         modalText: 'Add a recurring bill to keep track of your total average bill amount throughout the month',
                         namePlaceholder: 'Apartment Rent',
                         frequencyText: 'Enter an amount. For inconsistent bills such as gas and electricity, try and enter an average amount',
                         buttonClass: 'btn-AddMonthlyBill',
                         buttonVariant: 'danger',
                         popover: billPopover,
                         dropdownOptions: billDropDown
                    })
               break;


               case 'expense':
                    setItemPropertiesState({
                         title: "Expense",
                         modalText: 'Add a recurring expense to keep track of your total average expenses throughout the month',
                         namePlaceholder: 'Groceries',
                         frequencyText: 'Enter an amount. For inconsistent expenses such as groceries or coffee shop purchases, try and enter an average amount',
                         buttonClass: 'btn-AddMonthlyExpense',
                         buttonVariant: 'danger',
                         popover: expensePopover,
                         dropdownOptions: expenseDropDown
                    })
               break;


               case 'savings':
                    setItemPropertiesState({
                         title: "Savings",
                         modalText: 'Add any amounts that you contribute to your savings, as this is removed from your amount of disposable income.',
                         namePlaceholder: 'Savings Account',
                         frequencyText: 'Select a Savings Frequency. This is how often a you contribute to savings',
                         buttonClass: 'btn-AddMonthlySavings',
                         buttonVariant: 'success',
                         popover: savingsPopover,
                         dropdownOptions: savingsDropDown
                    })
               break;
          }

     }, [])


     // the different popovers, declared as their own consts to keep above useEffect easier to read
     const incomePopover = (
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

     const billPopover = (
          <Popover id="popover-basic" className="customPopover">
               <Popover.Header as="h3" className="customPopoverHeader">Add Monthly Bill</Popover.Header>
               
               <Popover.Body className="customPopoverBody">
                    Add any sort of regular bills you recieve to be incorporated into your monthly budget. While very similar to expenses, these tend to be more consistent in amount and are paid at regular intervals.
                    <br></br>
                    Some Examples:
                    <br></br>
                    <ul>
                         <li>Apartment Rent</li>
                         <li>Utilities</li>
                         <li>Mobile Phone Plan</li>
                         <li>Streaming Service Plan</li>
                         <li>Car Insurance</li>
                    </ul>
               </Popover.Body>
          </Popover>
     );

     const savingsPopover = (
          <Popover id="popover-basic" className="customPopover">
               <Popover.Header as="h3" className="customPopoverHeader">Add Monthly Savings</Popover.Header>
               
               <Popover.Body className="customPopoverBody">
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

     const expensePopover = (
          <Popover id="popover-basic" className="customPopover">
               <Popover.Header as="h3" className="customPopoverHeader">Add Monthly Expense</Popover.Header>
               
               <Popover.Body className="customPopoverBody">
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


     // the different dropdown options to accomodate different frequencies the items typically occur
     const incomeDropDown = (
          <>
          <option>⎯⎯⎯⎯⎯</option>
          <option>Weekly</option>
          <option>Every 2 Weeks</option>
          <option>Twice per Month</option>
          <option>Monthly</option>
          <option>Quarterly</option>
          </>
     )

     const billDropDown = (
          <>
          <option>⎯⎯⎯⎯⎯</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Twice per Year</option>
          <option>Yearly</option>
          </>
     )

     const expenseDropDown = (
          <>
          <option>⎯⎯⎯⎯⎯</option>
          <option>Daily</option>
          <option>Daily (excluding weekends)</option>
          <option>Weekends</option>
          <option>Weekly</option>
          <option>Monthly</option>
          </>
     )

     const savingsDropDown = (
          <>
          <option>⎯⎯⎯⎯⎯</option>
          <option>Weekly</option>
          <option>Every 2 Weeks</option>
          <option>Twice per Month</option>
          <option>Monthly</option>
          <option>Quarterly</option>
          </>
     )



     // state to keep track of user entered data
     const [itemDataState, setItemDataState] = useState({});

     // functions to show or hide the modal
     const showModalFunc = () => {setShowModal(true)};
     
     const hideModalFunc = () => {
          // clear the value state
          setItemDataState({});
          // hide the modal
          setShowModal(false);
     }

     // function to handle form item updates
     const handleChange = (value, name) => {
          setItemDataState({ ...itemDataState, [name]: value })
     }

     // read and generate unique GUIDS
     function guidGenerator() {
          
          // create empty array to be populated by all guids currently in the file
          let guidArray = [];

          // for each deductions item
          for (let i = 0; i < deductionsState.deductions.length; i++) {
               guidArray.push(deductionsState.deductions[i].GUID);
          }

          // for each incomes item
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


     
     // function to submit entered data from "adjust monthly payment modal"
     function submitBudgetItem() {
          // get the calculated monthly amount
          let calculatedMonthlyAmount = monthlyAmountCalculator();

          let newGuid = guidGenerator();

          // create an item object with the state and calculated monthly amount
          let itemObject = {
               ...itemDataState,
               Type: props.type,
               MonthlyAmount: calculatedMonthlyAmount,
               GUID: newGuid
          }

          // dispatch action to reducer based on type of object
          if (props.type == 'income') {
               dispatch(addIncome(itemObject));
          } else {
               dispatch(addDeduction(itemObject));
          }
          
          // clear the value state
          setItemDataState({});
          // hide the modal
          setShowModal(false);
     }



     // function to show estimated monthly payment
     function monthlyAmountCalculator() {
          // create empty var to be populated
          let monthlyTotal;

          // ensure both fields are selected
          if (itemDataState.hasOwnProperty("Frequency") && itemDataState.hasOwnProperty("Amount")) {
               
               let amount = new BigNumber(itemDataState.Amount);

               // switch for all the frequency options
               switch (itemDataState.Frequency) {
                    case "Daily":
                         monthlyTotal = amount.multipliedBy(365).dividedBy(12).toFixed(2);
                    break;

                    case "Daily (excluding weekends)":
                         monthlyTotal = amount.multipliedBy(5).multipliedBy(52).dividedBy(12).toFixed(2);
                    break;

                    case "Weekends":
                         monthlyTotal = amount.multipliedBy(52).dividedBy(12).toFixed(2);
                    break;

                    case "Weekly":
                         monthlyTotal = amount.multipliedBy(52).dividedBy(12).toFixed(2);
                    break;

                    case "Monthly":
                         monthlyTotal = amount.toFixed(2);
                    break;
               
                    case "Quarterly":
                         monthlyTotal = amount.multipliedBy(4).dividedBy(12).toFixed(2);
                    break;
                    
                    case "Twice per Year":
                         monthlyTotal = amount.multipliedBy(2).dividedBy(12).toFixed(2);
                    break;

                    case "Yearly":
                         monthlyTotal = amount.dividedBy(12).toFixed(2);
                    break;

                    case "Every 2 Weeks":
                         monthlyTotal = amount.multipliedBy(26).dividedBy(12).toFixed(2);
                    break;    
               
                    case "Twice per Month":
                         monthlyTotal = amount.multipliedBy(2).toFixed(2);
                    break;
               }

               return monthlyTotal;
          } else {
               return 0;
          }
     }
     

    


     return(
          <>
               <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={itemPropertiesState.popover}>
                    <Button variant={itemPropertiesState.buttonVariant} size="lg" className={itemPropertiesState.buttonClass}
                    onClick={showModalFunc}>
                         Add Monthly {itemPropertiesState.title}
                    </Button>
               </OverlayTrigger>

               <Modal
                    show={showModal}
                    onHide={hideModalFunc}
                    backdrop="static"
                    keyboard={false}
                    centered
                    dialogClassName="customModal">

                    <Modal.Header closeButton>
                         <Modal.Title>Add a Recurring {itemPropertiesState.title}</Modal.Title>
                    </Modal.Header>


                    <Modal.Body>
                         <h6>{itemPropertiesState.modalText}</h6>

                         <Form>
                              <Row>
                                   <Col>
                                        <Form.Group className="mb-3">
                                             <Form.Label>{itemPropertiesState.title} Name</Form.Label>
                                             <Form.Control type="Text" name="Name" placeholder={itemPropertiesState.namePlaceholder} 
                                             onChange={e => handleChange(e.target.value, e.target.name)} />
                                        </Form.Group>
                                   </Col>
                              </Row>

                              <Row>
                                   <Form.Group className="mb-3">
                                        <Form.Label>Select a {itemPropertiesState.title} Frequency. This is how often the {props.type} is recieved</Form.Label>
                                        <Form.Select  name="Frequency" onChange={e => handleChange(e.target.value, e.target.name)} >
                                             {itemPropertiesState.dropdownOptions}
                                        </Form.Select>
                                   </Form.Group>
                              </Row>

                              <Row>
                                   <Form.Group className="mb-3">
                                        <Form.Label>{itemPropertiesState.frequencyText}</Form.Label>
                                        <CurrencyInput
                                             prefix="$"
                                             name="Amount"
                                             placeholder="ex $200"
                                             decimalScale={2}
                                             decimalsLimit={2}
                                             allowNegativeValue={false}
                                             className="form-control"
                                             onValueChange={(value, name) => handleChange(value, name)}
                                        />
                                   </Form.Group>
                              </Row>
                         </Form>

                         <div className="monthlyTotalDiv">
                              <span>Your {props.type} is approximately</span>
                              <h2>{moneyFormatter(monthlyAmountCalculator())}</h2>
                              <span>per month</span>
                         </div>

                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={() => hideModalFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitBudgetItem()}
                         disabled={!(itemDataState.hasOwnProperty("Name")) || !(itemDataState.hasOwnProperty("Frequency")) || !(itemDataState.hasOwnProperty("Amount")) ? true : false}>
                              Record
                         </Button>
                    </Modal.Footer>

               </Modal>
          </>
     );
}