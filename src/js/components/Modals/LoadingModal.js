import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";


import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { clearFormData } from "../../Redux/features/AddALoanSlice";

import { FaSpinner } from "react-icons/fa";






export default function LoadingModal(props) {

     

     return(
          <>

               <Modal
                    show={props.showModal}
                    centered>

                    <Modal.Body>
                         <div className="loadingDiv">
                              <div class="loaderSpinner">Loading...</div>
                         </div>
                    </Modal.Body>

               </Modal>

          </>
     )

}