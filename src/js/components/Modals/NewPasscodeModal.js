import React, { useEffect, useState } from "react";

import { Button, Form, Modal, Table, Popover, Overlay, OverlayTrigger, Alert } from "react-bootstrap";

// import icons 
import { FaLock } from "react-icons/fa";

// import actions from deductions slice
import { setUserPIN } from "../../Redux/features/SettingsSlice";



import { useSelector, useDispatch } from "react-redux";





export default function NewPasscode() {

    const dispatch = useDispatch();


    // FIRST MODAL
        // there are two modals in this file, one for intitial entry and one for verification
    // state for showing or hiding the modals
    const [showModal_1, setShowModal_1] = useState(false);

    // functions to show or hide the first modal
    const showModalFunc_1 = () => {setShowModal_1(true)};
    const hideModalFunc_1 = () => {
        // clear the state 
        setNewPasscodeState({
            PasscodeInitial: "",
            PasscodeVerify: ""
        })
        // hide the modal
        setShowModal_1(false);
    }

    // state for handling the new passcode
    const [newPasscodeState, setNewPasscodeState] = useState({
        PasscodeInitial: "",
        PasscodeVerify: ""
    });


    // state for error handling
    const [errorState, setErrorState] = useState({
        error: false,
        errorText: ""
    })

    // handle the entered text from the initial entry
    const handleChange = (value, name) => {
        
        // only accept the value if it is a number 
        let formattedValue = value.replace(/\D/g, "");
        
        // set the state equal to the new value
        setNewPasscodeState({ ...newPasscodeState, [name]: formattedValue }); 
    }

    // function to validate the initial entry and begin verification
    function newPINSubmissionFirstEntry() {
        // if the passcode length is valid
        if (newPasscodeState.PasscodeInitial.length == 4) {
            // hide the first modal
            setShowModal_1(false);

            // show the second modal
            setShowModal_2(true)
        }   
    }



    // SECOND MODAL    
    // state for showing or hiding the modal
    const [showModal_2, setShowModal_2] = useState(false);

    // functions to show or hide the second modal
    const showModalFunc_2 = () => {setShowModal_2(true)};
    const hideModalFunc_2 = () => {
        // clear the state 
        setNewPasscodeState({
            PasscodeInitial: "",
            PasscodeVerify: ""
        })
        // hide the modal
        setShowModal_2(false);
    }


    // final submission
    function submitNewPassword(){
        // if the passwords match
        if (newPasscodeState.PasscodeInitial == newPasscodeState.PasscodeVerify) {
    
            // dispatch the action
            dispatch(setUserPIN(newPasscodeState.PasscodeVerify));

            // clear the state
            setNewPasscodeState({
                PasscodeInitial: "",
                PasscodeVerify: ""
            })

            // hide the modal
            setShowModal_2(false);
        }
    }

    // watch the passcode state,
    useEffect(()=>{
        // if both passcodes are 4 digits and not equal to each other
        if (newPasscodeState.PasscodeInitial.length == 4 
            && newPasscodeState.PasscodeVerify.length == 4
            && newPasscodeState.PasscodeInitial != newPasscodeState.PasscodeVerify) {
                // show an error message
                setErrorState({
                    error: true,
                    errorText: "The Passcodes do not match"
                })

        // if both passcodes are 4 digits and equal to each other
        } else if (newPasscodeState.PasscodeInitial.length == 4 
            && newPasscodeState.PasscodeVerify.length == 4
            && newPasscodeState.PasscodeInitial === newPasscodeState.PasscodeVerify) {
                // hide error message
                setErrorState({
                    error: false,
                    errorText: ""
                })

        } else {
            // hide error message
            setErrorState({
                error: false,
                errorText: ""
            })
        }
    }, [newPasscodeState])

    const popover = (
        <Popover id="popover-basic" className="customPopover">
            <Popover.Header as="h3" className="customPopoverHeader">Add a Passcode</Popover.Header>
            
            <Popover.Body className="customPopoverBody">
                If this is a shared computer and you would like to prevent unwanted access to your data, consider adding a passcode.
            </Popover.Body>
        </Popover>
    );

    return(
        <>

            {/* First Modal for intitial entry */}
            <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={popover}>
                <Button variant="primary"
                onClick={showModalFunc_1}
                size="lg">
                    <FaLock className="themeButtonIcon"/>Add a Passcode
                </Button>
            </OverlayTrigger>

            <Modal
                show={showModal_1}
                onHide={hideModalFunc_1}
                backdrop="static"
                keyboard={false}
                centered>

                <Modal.Header closeButton>
                        <Modal.Title>
                            Add a Passcode
                        </Modal.Title>
                </Modal.Header>


                <Modal.Body>
                    <Form onSubmit={event => event.preventDefault()}>
                        <Form.Group controlId="FirstPasscodeEntry">
                            <Form.Label>Enter a 4-digit Numeric Passcode</Form.Label>
                            <Form.Control
                            name="PasscodeInitial"
                            type="password"
                            className="passwordInput"
                            maxLength={4}
                            value={newPasscodeState.PasscodeInitial}
                            autoFocus
                            onChange={e => handleChange(e.target.value, e.target.name)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => hideModalFunc_1()}>
                        Cancel
                    </Button>

                    <Button variant="success" onClick={() => newPINSubmissionFirstEntry()}
                    disabled={newPasscodeState.PasscodeInitial.length === 4 ? false : true}>
                        Next
                    </Button>
                </Modal.Footer>
            </Modal>





            {/* Second Modal for verification of first entry */}
            <Modal
                show={showModal_2}
                onHide={hideModalFunc_2}
                backdrop="static"
                keyboard={false}
                centered>

                <Modal.Header closeButton>
                        <Modal.Title>
                            Re-enter your 4-digit Number Passcode
                        </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={event => event.preventDefault()}>
                        <Form.Group controlId="FirstPasscodeEntry">
                            <Form.Control
                            name="PasscodeVerify"
                            type="password"
                            className="passwordInput"
                            maxLength={4}
                            value={newPasscodeState.PasscodeVerify}
                            onChange={e => handleChange(e.target.value, e.target.name)}
                            />
                        </Form.Group>
                    </Form>

                    <Alert variant="danger" show={errorState.error}>
                        {errorState.errorText}
                    </Alert>
                    
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => hideModalFunc_2()}>
                        Cancel
                    </Button>

                    <Button variant="success" onClick={()=>submitNewPassword()}
                    disabled={newPasscodeState.PasscodeVerify.length === 4 && newPasscodeState.PasscodeInitial === newPasscodeState.PasscodeVerify ? false : true}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}