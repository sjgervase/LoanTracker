import React, { useEffect, useState } from "react";

import CurrencyInput from "react-currency-input-field";

import { Button, Form, Modal, Table } from "react-bootstrap";

import { BigNumber } from "bignumber.js"

import { ipcRenderer } from "electron";







export default function AddMonthlyBillModal() {

     // state for showing or hiding the modal
     const [showAddMonthlyBill, setShowAddMonthlyBill] = useState(false);


     // state to keep track of user entered data
     const [monthlyBillState, setMonthlyBillState] = useState();



     // functions to show or hide the modal
     const showAddMonthlyBillFunc = () => {setShowAddMonthlyBill(true)};
     
     
     const hideAddMonthlyBillFunc = () => {
         
          // clear the value state
          setMonthlyBillState();
          // hide the modal
          setShowAddMonthlyBill(false);
     }


     

     // function to submit entered data from "adjust monthly payment modal"
     function submitMonthlyBill() {
          console.log("submit");

          // ipcRenderer.invoke('desiredMonthlyPaymentSubmission', (monthlyPaymentSubmission));
          // hide the modal
          // setShowAddMonthlyBill(false);
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
                    size="lg"
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Add a monthly bill</Modal.Title>
                    </Modal.Header>


                    <Modal.Body>
                         <p className="lead">Add a recurring monthly bill to keep track of your total average expenses throughout the month</p>

                         <Form.Group className="mb-3 loanItemViewRangeSlider">

                         </Form.Group>
                    </Modal.Body>




                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={() => hideAddMonthlyBillFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitMonthlyBill()}>
                              Record
                         </Button>
                    </Modal.Footer>

               </Modal>
          </>
     );
}