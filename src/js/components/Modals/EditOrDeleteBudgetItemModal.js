import React, { useEffect, useState } from "react";

import CurrencyInput from "react-currency-input-field";

import { Button, Form, Modal, Table, Popover, Overlay, OverlayTrigger } from "react-bootstrap";

import { BigNumber } from "bignumber.js"

import { ipcRenderer } from "electron";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";


// import components
import EditOrDeleteBudgetItemList from "../ListMaps/EditDeleteBudgetItemList";






export default function EditOrDeleteBudgetItem(props) {

     // get data from redux store
     const incomesState = useSelector((state) => state.incomes);
     const deductionsState = useSelector((state) => state.deductions);

     

     // console.log(props);

     let billsArray = [];
     let expenseArray = [];
     let savingsArray = [];

     // sort recieved prop deductions
     for (let i = 0; i < deductionsState.deductions.length; i++) {
          
          if (deductionsState.deductions[i].Type == "bill") {
               billsArray.push({
                    ...deductionsState.deductions[i]
               })
          } else if (deductionsState.deductions[i].Type == "expense") {
               expenseArray.push({
                    ...deductionsState.deductions[i]
               })
          } else {
               savingsArray.push({
                    ...deductionsState.deductions[i]
               })
          }
     }





     // state for showing or hiding the modal
     const [showModal, setShowModal] = useState(false);


     // functions to show or hide the modal
     const showModalFunc = () => {setShowModal(true)};
     
     
     const hideEditDeleteItemFunc = () => {
          // clear the value state
          
          // hide the modal
          setShowModal(false);
     }



     const popover = (
          <Popover id="popover-basic" className="customPopover">
               <Popover.Header as="h3" className="customPopoverHeader">Edit / Delete Item</Popover.Header>
               
               <Popover.Body className="customPopoverBody">
                    Use this tool to delete or edit one of your added budget items. Loans can only be deleted in the <b>All Loans</b> page
                    <br></br>
                    Some Examples:
                    <br></br>
                    <ul>
                         <li>Adjust Income to account for raise or promotion</li>
                         <li>Rent Increase</li>
                         <li>More devotion to savings account</li>
                    </ul>
               </Popover.Body>
          </Popover>
     );


     return(
          <>
               <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={popover}>
                    <Button variant="primary" size="lg"
                    onClick={showModalFunc}>
                         Edit or Delete Item
                    </Button>
               </OverlayTrigger>

               <Modal
                    show={showModal}
                    onHide={hideEditDeleteItemFunc}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Edit or Delete Budget Item</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                         
                         {/* ternary if to hide entire list if there are table would be empty */}
                         {incomesState.incomes.length == 0 ? "" :
                              <EditOrDeleteBudgetItemList
                                   array={incomesState.incomes}
                                   name={"Income"}
                              />
                         }
                         
                         {/* ternary if to hide entire list if there are table would be empty */}
                         {billsArray.length == 0 ? "" :
                              <EditOrDeleteBudgetItemList
                                   array={billsArray}
                                   name={"Bill"}
                              />
                         }

                         {/* ternary if to hide entire list if there are table would be empty */}
                         {expenseArray.length == 0 ? "" :
                              <EditOrDeleteBudgetItemList
                                   array={expenseArray}
                                   name={"Expense"}
                              />
                         }

                         {/* ternary if to hide entire list if there are table would be empty */}
                         {savingsArray.length == 0 ? "" :
                              <EditOrDeleteBudgetItemList
                                   array={savingsArray}
                                   name={"Saving"}
                              />
                         }

                         {/* if nothing has been added */}
                         {incomesState.incomes.length == 0 && billsArray.length == 0 && expenseArray.length == 0 && savingsArray.length == 0 ? "You have not added any Incomes, Expenses, Bills, or Savings and therefore have nothing to edit or delete." : ""}

                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="success" onClick={() => hideEditDeleteItemFunc()}>
                              Done
                         </Button>
                    </Modal.Footer>

               </Modal>
          </>
     );
}