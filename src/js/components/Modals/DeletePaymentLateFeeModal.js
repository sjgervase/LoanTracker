import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { ipcRenderer } from "electron";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import store actions
import { deletePaymentOrLateFee } from "../../Redux/features/LoansSlice";



export default function DeletePaymentLateFeeModal(props) {

     const dispatch = useDispatch();

     // state to show delete modal
     const [showModal, setShowModal] = useState(false);

     const handleDeleteModalClose = () => setShowModal(false);
     const handleDeleteModalShow = () => setShowModal(true);

     
     // function to format date to MM-DD-YYYY
     function formatDate (input) {
          var datePart = input.match(/\d+/g),
          year = datePart[0].substring(2), // get only two digits
          month = datePart[1], day = datePart[2];

          return month+'/'+day+'/'+year;     
     }


     function deletePaymentLateFee() {

          let GUIDTimestampTypeAmount = {
               GUID: props.item.loanGUID,
               TimeStamp: props.item.dateRecorded,
               Type: (props.item.type == "payment" ? "PaymentHistory" : "LateFees"),
               Amount: props.item.amount
          }

          // dispatch action to the store
          dispatch(deletePaymentOrLateFee(GUIDTimestampTypeAmount));

          // ipcRenderer.invoke('deletePaymentLateFee', (GUIDAndTimestampType));

          // hide the modal
          setShowModal(false)
     }

     return(
          <>
               <Button 
               variant="outline-danger" 
               className="btn-sm btn-custom py0 deletePaymentLateFeeButton" 
               onClick={handleDeleteModalShow}>
                    Delete
               </Button>

               <Modal
                    show={showModal}
                    onHide={handleDeleteModalClose}
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Delete this {props.item.type == "payment" ? "payment" : "late fee"}?</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                         <span>This should only be done if either the amount or the date is erroneous.</span>
                         <div className="modalBody">
                              <Table striped bordered hover>
                                   <tbody>
                                        <tr>
                                             <td>Loan Name:</td>
                                             <td>{props.item.loanName}</td>
                                        </tr>
                                        <tr>
                                             <td>Amount:</td>
                                             <td>{props.item.amount}</td>
                                        </tr>
                                        <tr>
                                             <td>Date Made:</td>
                                             <td>{formatDate(props.item.dateMade)}</td>
                                        </tr>
                                   </tbody>
                              </Table>
                         </div>
                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={handleDeleteModalClose}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={deletePaymentLateFee}>
                              Yes
                         </Button>
                    </Modal.Footer>

               </Modal>

          </>
     )
}