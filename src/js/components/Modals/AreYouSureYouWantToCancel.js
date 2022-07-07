import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";


import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { clearFormData } from "../../Redux/features/AddALoanSlice";







export default function AreYouSureYouWantToCancel() {
     const dispatch = useDispatch();
     let navigate = useNavigate();

     // state to show delete modal
     const [showModal, setShowModal] = useState(false);

     const handleModalClose = () => setShowModal(false);
     const handleModalShow = () => setShowModal(true);

     
     
     // cancel the form and navigate to overview
     function cancelForm() {
          dispatch(clearFormData());
          // return to overview
          navigate('/');

          // hide the modal
          setShowModal(false);    
     }


     return(
          <>
               <Button variant="outline-danger" size="lg" type="cancel" onClick={handleModalShow}>
                    Cancel
               </Button>

               <Modal
                    show={showModal}
                    onHide={handleModalClose}
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Are you sure you want to cancel?</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                         <p>All form data will be deleted</p>
                    </Modal.Body>

                    <Modal.Footer>
                         <Button variant="outline-primary" onClick={handleModalClose}>
                              Wait, Go Back!
                         </Button>

                         <Button variant="danger" onClick={()=> cancelForm()}>
                              Yes, Cancel
                         </Button>
                    </Modal.Footer>

               </Modal>

          </>
     )

}