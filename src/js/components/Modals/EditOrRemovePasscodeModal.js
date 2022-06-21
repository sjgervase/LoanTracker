import React, { useEffect, useState } from "react";

import { Button, Form, Modal, Table, Popover, Overlay, OverlayTrigger, Alert } from "react-bootstrap";

// import icons 
import { FaLock } from "react-icons/fa";

// import actions from deductions slice
import { setUserPIN } from "../../Redux/features/SettingsSlice";



import { useSelector, useDispatch } from "react-redux";





export default function EditOrRemovePasscode() {

    const dispatch = useDispatch();

    // get all settings from redux store
    const settingsState = useSelector((state) => state.settings);

    // get the current passcode
    const currentPasscode = settingsState.settings[0]?.UserPIN;

    // state for handling the new passcode
    const [passcodeState, setPasscodeState] = useState({
        CurrentPasscode: "",
        PasscodeVerify: "",
        PasscodeAction: "",
        NewPasscodeInitial: "",
        NewPasscodeVerify: ""
    });

    // useEffect to populate state when current passcode is not undefined
    useEffect(()=>{
        // if the current passcode in settings slice is defined
        if (currentPasscode) {
            // add it to the current state
            setPasscodeState({
                ...passcodeState,
                CurrentPasscode: currentPasscode
            })
        }
    }, [currentPasscode])


    // state for error handling
    const [errorState, setErrorState] = useState({
        error: false,
        errorText: ""
    })


    // handle the entered values from the forms
    const handleChange = (value, name) => {

        // if the name of the changed field is NOT the password action
        if (name != "PasscodeAction") {
            // only accept the value if it is a number 
            let formattedValue = value.replace(/\D/g, "");

            // set the state
            setPasscodeState({
                ...passcodeState,
                [name]: formattedValue
            })
            
        } else {
            // set the state
            setPasscodeState({
                ...passcodeState,
                [name]: value
            })
        }
    }



    // FIRST MODAL
        // This modal handles the initial verification of the passcode
    // state for showing or hiding the modals
    const [showModal_1, setShowModal_1] = useState(false);

    // functions to show or hide the first modal
    const showModalFunc_1 = () => {setShowModal_1(true)};
    const hideModalFunc_1 = () => {
        // clear the state, retaining only the current passcode
        setPasscodeState({
            ...passcodeState,
            PasscodeVerify: "",
            PasscodeAction: "",
            NewPasscodeInitial: "",
            NewPasscodeVerify: ""
        })
        
        // hide the modal
        setShowModal_1(false);
    }

    // watch passcode state and show error messages if necessary
    useEffect(() =>{
        // if the entered passcode has a length of 4 and is not equal to the current passcode
        if (passcodeState.PasscodeVerify.length == 4
            && passcodeState.PasscodeVerify != passcodeState.CurrentPasscode) {
            // show error message
            setErrorState({
                error: true,
                errorText: "The entered passcode does not match your currently saved passcode"
            })

        // if the initial new passcode does not equal the initial new passcode 
        } else if(passcodeState.NewPasscodeVerify.length == 4
            && passcodeState.NewPasscodeInitial != passcodeState.NewPasscodeVerify) {
            // show error message
            setErrorState({
                error: true,
                errorText: "The entered passcode does not match the new passcode you have just entered"
            })

        // else, there is no error
        } else {
            // hide the error message
            setErrorState({
                error: false,
                errorText: ""
            })
        }
    }, [passcodeState])


    // if the entered passcode is equal to the current passcode
    function verifyPasscode() {
        // hide the first modal
        setShowModal_1(false);

        // show the second modal
        setShowModal_2(true)
    }




    // SECOND MODAL
        // this modal handles what the user wants to do, change their passcode or remove their passcode
    // state for showing or hiding the modals
    const [showModal_2, setShowModal_2] = useState(false);

    // functions to show or hide the first modal
    const showModalFunc_2 = () => {setShowModal_2(true)};
    const hideModalFunc_2 = () => {
        // clear the state, retaining only the current passcode
        setPasscodeState({
            ...passcodeState,
            PasscodeVerify: "",
            PasscodeAction: "",
            NewPasscodeInitial: "",
            NewPasscodeVerify: ""
        })
        
        // hide the modal
        setShowModal_2(false);
    }


    // function that handles which the next modal to show based on which aciton the user has selected
    function submitAction() {
        switch (passcodeState.PasscodeAction) {
            case "RemovePasscode":
                // hide modal 2
                setShowModal_2(false);

                // show modal 3
                setShowModal_3(true);
            break;

            case "ChangePasscode":
                // hide modal 2
                setShowModal_2(false);

                // show modal 4
                setShowModal_4(true);
            break;
        
            default:
            break;
        }
    }


    // THIRD MODAL
        // this modal is an "are you sure" for removing your passcode
    // state for showing or hiding the modals
    const [showModal_3, setShowModal_3] = useState(false);

    // functions to show or hide the first modal
    const showModalFunc_3 = () => {setShowModal_3(true)};
    const hideModalFunc_3 = () => {
        // clear the state, retaining only the current passcode
        setPasscodeState({
            ...passcodeState,
            PasscodeVerify: "",
            PasscodeAction: "",
            NewPasscodeInitial: "",
            NewPasscodeVerify: ""
        })
        
        // hide the modal
        setShowModal_3(false);
    }


    // function for if user decides to remove any passcode protection
    function removePasscode() {
        // dispatch the aciton with the payload being the internal string for when a user does not have a passcode
        dispatch(setUserPIN("NOPIN"));

        // clear the state, retaining only the current passcode
        setPasscodeState({
            ...passcodeState,
            PasscodeVerify: "",
            PasscodeAction: "",
            NewPasscodeInitial: "",
            NewPasscodeVerify: ""
        })
    }



    // FOURTH MODAL
        // this modal is where the user enters a new passcode for the first time
    // state for showing or hiding the modals
    const [showModal_4, setShowModal_4] = useState(false);

    // functions to show or hide the first modal
    const showModalFunc_4 = () => {setShowModal_4(true)};
    const hideModalFunc_4 = () => {
        // clear the state, retaining only the current passcode
        setPasscodeState({
            ...passcodeState,
            PasscodeVerify: "",
            PasscodeAction: "",
            NewPasscodeInitial: "",
            NewPasscodeVerify: ""
        })
        
        // hide the modal
        setShowModal_4(false);
    }

    // function to verify the new passcode
    function verifyNewPasscode() {
        // hide the forth modal
        setShowModal_4(false);

        // show the fifth modal
        setShowModal_5(true);
    }



    // FIFTH MODAL
        // this modal is to verify the new passcode entered in the fourth modal
    // state for showing or hiding the modals
    const [showModal_5, setShowModal_5] = useState(false);

    // functions to show or hide the first modal
    const showModalFunc_5 = () => {setShowModal_5(true)};
    const hideModalFunc_5 = () => {
        // clear the state, retaining only the current passcode
        setPasscodeState({
            ...passcodeState,
            PasscodeVerify: "",
            PasscodeAction: "",
            NewPasscodeInitial: "",
            NewPasscodeVerify: ""
        })
        
        // hide the modal
        setShowModal_5(false);
    }
    
    // function for submission of new passcode
    function submitNewPasscode() {
        // dispatch the aciton with the payload being the internal string for when a user does not have a passcode
        dispatch(setUserPIN(passcodeState.NewPasscodeVerify));

        // clear the state, retaining only the current passcode
        setPasscodeState({
            ...passcodeState,
            PasscodeVerify: "",
            PasscodeAction: "",
            NewPasscodeInitial: "",
            NewPasscodeVerify: ""
        })

        // hide the modal
        setShowModal_5(false);
    }

    

    
    const popover = (
        <Popover id="popover-basic" className="customPopover">
            <Popover.Header as="h3" className="customPopoverHeader">Edit or Remove Passcode</Popover.Header>
            
            <Popover.Body className="customPopoverBody">
                If you need a different passcode or no longer need one at all.
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
                        <FaLock className="themeButtonIcon"/>Edit or Remove Passcode
                </Button>
            </OverlayTrigger>

            <Modal
                show={showModal_1}
                onHide={hideModalFunc_1}
                backdrop="static"
                keyboard={false}
                centered
                dialogClassName="customModal">

                <Modal.Header closeButton>
                        <Modal.Title>
                            First, enter your currrent passcode
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
                            value={passcodeState.PasscodeVerify}
                            autoFocus
                            onChange={e => handleChange(e.target.value, e.target.name)}
                            />
                        </Form.Group>
                    </Form>

                    <Alert variant="danger" show={errorState.error}>
                        {errorState.errorText}
                    </Alert>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => hideModalFunc_1()}>
                        Cancel
                    </Button>

                    <Button variant="success" onClick={() => verifyPasscode()}
                    disabled={errorState.error || passcodeState.PasscodeVerify.length < 4}>
                        Verify
                    </Button>
                </Modal.Footer>
            </Modal>





            {/* Second Modal for selecting passcode action - remove or change */}
            <Modal
                show={showModal_2}
                onHide={hideModalFunc_2}
                backdrop="static"
                keyboard={false}
                centered
                dialogClassName="customModal">

                <Modal.Header closeButton>
                        <Modal.Title>
                            What do you want to do?
                        </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={event => event.preventDefault()}>
                        {['radio'].map((type) => (
                            <div key={`passcode-${type}`} className="mb-3">
                            <Form.Check
                                label="Change your Passcode"
                                name="PasscodeAction"
                                type={type}
                                id={`passcode-${type}-1`}
                                value={"ChangePasscode"}
                                onChange={e => handleChange(e.target.value, e.target.name)}
                            />
                            <Form.Check
                                label="Remove Your Passcode"
                                name="PasscodeAction"
                                type={type}
                                id={`passcode-${type}-2`}
                                value={"RemovePasscode"}
                                onChange={e => handleChange(e.target.value, e.target.name)}
                            />
                            </div>
                        ))}

                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => hideModalFunc_2()}>
                        Cancel
                    </Button>

                    <Button variant="success" onClick={()=>submitAction()}
                    disabled={passcodeState.PasscodeAction == "" ? true : false}>
                        Next
                    </Button>
                </Modal.Footer>
            </Modal>





            {/* Third Modal for ensuring user is sure they want to remove their passcode */}
            <Modal
                show={showModal_3}
                onHide={hideModalFunc_3}
                backdrop="static"
                keyboard={false}
                centered
                dialogClassName="customModal">

                <Modal.Header closeButton>
                        <Modal.Title>
                            Are you sure you want to remove your passcode?
                        </Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => hideModalFunc_3()}>
                        Cancel
                    </Button>

                    <Button variant="danger" onClick={()=>removePasscode()}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>




            {/* Fourth Modal for entering a new passcode if the passcode action is to change passcode*/}
            <Modal
                show={showModal_4}
                onHide={hideModalFunc_4}
                backdrop="static"
                keyboard={false}
                centered
                dialogClassName="customModal">

                <Modal.Header closeButton>
                        <Modal.Title>
                            Enter a new 4-digit Numeric Passcode
                        </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={event => event.preventDefault()}>
                        <Form.Group controlId="FirstPasscodeEntry">
                            <Form.Control
                            name="NewPasscodeInitial"
                            type="password"
                            className="passwordInput"
                            maxLength={4}
                            value={passcodeState.NewPasscodeInitial}
                            autoFocus
                            onChange={e => handleChange(e.target.value, e.target.name)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                

                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => hideModalFunc_4()}>
                        Cancel
                    </Button>

                    <Button variant="success" onClick={()=>verifyNewPasscode()}
                    disabled={errorState.error || passcodeState.NewPasscodeInitial.length < 4}>
                        Next
                    </Button>
                </Modal.Footer>
            </Modal>





            {/* Fifth Modal for verifying the passcode entered in the fourth modal*/}
            <Modal
                show={showModal_5}
                onHide={hideModalFunc_5}
                backdrop="static"
                keyboard={false}
                centered
                dialogClassName="customModal">

                <Modal.Header closeButton>
                        <Modal.Title>
                            Re-Enter your new 4-digit Numeric Passcode
                        </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={event => event.preventDefault()}>
                        <Form.Group controlId="FirstPasscodeEntry">
                            <Form.Control
                            name="NewPasscodeVerify"
                            type="password"
                            className="passwordInput"
                            maxLength={4}
                            value={passcodeState.NewPasscodeVerify}
                            autoFocus
                            onChange={e => handleChange(e.target.value, e.target.name)}
                            />
                        </Form.Group>
                    </Form>

                    <Alert variant="danger" show={errorState.error}>
                        {errorState.errorText}
                    </Alert>
                </Modal.Body>
                

                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => hideModalFunc_5()}>
                        Cancel
                    </Button>

                    <Button variant="success" onClick={()=>submitNewPasscode()}
                    disabled={errorState.error || passcodeState.NewPasscodeVerify.length < 4}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}