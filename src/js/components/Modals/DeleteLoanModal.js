import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { ipcRenderer } from "electron";

// import action from store
import { deleteLoan } from "../../Redux/features/LoansSlice";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export default function DeleteLoanModal(props) {
     const dispatch = useDispatch();

     // state to show delete modal
     const [showModal, setShowModal] = useState(false);

     const handleDeleteModalClose = () => setShowModal(false);
     const handleDeleteModalShow = () => setShowModal(true);

     const location = useLocation();

     let navigate = useNavigate();

     function deleteLoanFunc() {
          // hide the modal
          setShowModal(false);

          // navigate to the dashboard if on loanItemView
          if (location.pathname === "/loanitemview") {
               navigate('/');
          }

          // dispatch the action to delete the loan
          dispatch(deleteLoan(props.loanGUID));
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
                    show={showModal}
                    onHide={handleDeleteModalClose}
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Delete this Loan?</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                         <p>Are you sure you want to delete {props.loanName}? All data regarding this loan will be permanently deleted.</p>
                         
                         <h6>This cannot be undone</h6>
                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="outline-secondary" onClick={handleDeleteModalClose}>
                              Cancel
                         </Button>

                         <Button variant="danger" onClick={()=>deleteLoanFunc()}>
                              Yes
                         </Button>
                    </Modal.Footer>

               </Modal>

          </>
     )

}