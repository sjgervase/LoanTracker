import React, { useEffect, useState } from "react";

import { Button, Form, Modal, Table, Popover, Overlay, OverlayTrigger } from "react-bootstrap";


// import actions from deductions slice
import { addDeduction } from "../../Redux/features/DeductionsSlice";

import { useSelector, useDispatch } from "react-redux";





export default function LoginPIN() {

    const dispatch = useDispatch();

    // get data from redux store
    const settingsState = useSelector((state) => state.settings);

    // get the current passcode
    const CurrentPasscode = settingsState.settings[0]?.UserPin;
    console.log(CurrentPasscode);

    // state for showing or hiding the modal
    const [showModal, setShowModal] = useState(false);

    // functions to show or hide the modal
    const showModalFunc = () => {setShowModal(true)};
    const hideModalFunc = () => {
        // hide the modal
        setShowModal(false);
    }

    // state to handle Passcode
    const [passcodeState, setPasscodeState] = useState(CurrentPasscode);

    console.log(passcodeState);

    // function to handle submission
    function submitLoginPIN(){
        console.log("submit");
    }
    

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Add a Passcode</Popover.Header>
            
            <Popover.Body>
                If this is a shared computer and you would like to secure your data, consider adding a Passcode to this app.
            </Popover.Body>
        </Popover>
    );


    return(
        <>
            <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={popover}>
                <Button variant="primary"
                onClick={showModalFunc}>
                        Add a Passcode
                </Button>
            </OverlayTrigger>

            <Modal
                show={showModal}
                onHide={hideModalFunc}
                backdrop="static"
                keyboard={false}
                centered>

                <Modal.Header closeButton>
                        <Modal.Title>Add a Passcode</Modal.Title>
                </Modal.Header>


                <Modal.Body>
                    
                </Modal.Body>


                <Modal.Footer>
                        <Button variant="outline-danger" onClick={() => hideModalFunc()}>
                            Cancel
                        </Button>

                        <Button variant="success" onClick={() => submitLoginPIN()}>
                            Save
                        </Button>
                </Modal.Footer>

            </Modal>
        </>
    );
}