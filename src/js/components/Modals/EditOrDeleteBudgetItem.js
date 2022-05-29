import React, { useEffect, useState } from "react";

import CurrencyInput from "react-currency-input-field";

import { Button, Form, Modal, Table, Popover, Overlay, OverlayTrigger } from "react-bootstrap";

import { BigNumber } from "bignumber.js"

import { ipcRenderer } from "electron";


// import components
import EditOrDeleteBudgetItemList from "../ListMaps/EditDeleteBudgetItemList";






export default function EditOrDeleteBudgetItem(props) {

     // console.log(props);

     let billsArray = [];
     let expenseArray = [];
     let savingsArray = [];

     // sort recieved prop deductions
     for (let i = 0; i < props.deductions?.length; i++) {
          
          if (props.deductions[i].Type == "bill") {
               billsArray.push({
                    ...props.deductions[i]
               })
          } else if (props.deductions[i].Type == "expense") {
               expenseArray.push({
                    ...props.deductions[i]
               })
          } else {
               savingsArray.push({
                    ...props.deductions[i]
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
          <Popover id="popover-basic">
               <Popover.Header as="h3">Edit / Delete Item</Popover.Header>
               
               <Popover.Body>
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


                    <EditOrDeleteBudgetItemList
                         array={props.incomes}
                         name={"Income"}
                    />
                         
                    <EditOrDeleteBudgetItemList
                         array={billsArray}
                         name={"Bill"}
                    />

                    <EditOrDeleteBudgetItemList
                         array={expenseArray}
                         name={"Expense"}
                    />

                    <EditOrDeleteBudgetItemList
                         array={savingsArray}
                         name={"Saving"}
                    />















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