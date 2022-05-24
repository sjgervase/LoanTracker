import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { ipcRenderer } from "electron";

export default function DeleteLoanModal(props) {

     // state to show delete modal
     const [showDeleteModal, setShowDeleteModal] = useState(false);

     const handleDeleteModalClose = () => setShowDeleteModal(false);
     const handleDeleteModalShow = () => setShowDeleteModal(true);


     function deleteLoan() {
          ipcRenderer.invoke('deleteLoan', (props.loan.GUID));

          setShowDeleteModal(false)
     }



     return(
          <>
               <Button 
               variant="danger" 
               className="btn-sm btn-custom py0" 
               onClick={handleDeleteModalShow}>
                    Delete This Loan
               </Button>

               <Modal
                    show={showDeleteModal}
                    onHide={handleDeleteModalClose}
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Delete this Loan?</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                         <p>Are you sure you want to delete {props.loan.LoanName}? All data regarding this loan will be permanently deleted.</p>
                         
                         <h6>This cannot be undone</h6>
                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="outline-secondary" onClick={handleDeleteModalClose}>
                              Cancel
                         </Button>

                         <Button variant="danger" onClick={deleteLoan}>
                              Yes
                         </Button>
                    </Modal.Footer>

               </Modal>

          </>
     )

}