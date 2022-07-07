import React from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import store actions
import { addFieldToFormData } from "../../Redux/features/AddALoanSlice";

// import from react-bootstrap
import { Form } from "react-bootstrap";


export default function OptionalLoanInfo(props) {

     const dispatch = useDispatch();

     // function to handle changes to form fields
     const handleChange = (name, value) => {
          // dispatch the action to the store
          dispatch(addFieldToFormData({[name]:value}));
     }

     // as these are simple and optional fields, no validation is required
     
     return (
          <div className="addALoanOptionalInfo dashboardModule">
               <div className="moduleHeader">
                    <h2>Optional Loan Information</h2>
               </div>
               <h6 className="optionalInfoDesc">The fields in this section are not required, but the additional data may allow some features to work or simply be nice to remember later.</h6>

               {/* First Row */}
               <div className="formGroupRow">
                    {/* Loan Link */}
                    <Form.Group controlId="LoanLink" className="loanLinkDiv">
                         <Form.Label>Loan Link</Form.Label>
                         <Form.Control type="Text" name="LoanLink" placeholder="ex www.bank.com/PayLoan" 
                         onChange={e => handleChange(e.target.name, e.target.value)}
                         className="addALoanInput"/>
                         <Form.Text className="text-muted">This is for quick access to make payments</Form.Text>
                    </Form.Group>
               </div>


               {/* Second Row */}
               <div className="formGroupRow additionalNotesRow">
                    <Form.Group controlId="AdditionalNotes" className="additionalNotesDiv">
                         <Form.Label>Additional Notes</Form.Label>
                         <Form.Control as="textarea" rows={3} name="AdditionalNotes" placeholder="ex This Loan is for..." 
                         onChange={e => handleChange(e.target.name, e.target.value)}
                         className="addALoanInput addALoanTextArea"/>
                         <Form.Text className="text-muted">Any other notes you want attached to this loan. NEVER include passwords in this box.</Form.Text>
                    </Form.Group>
               </div>
          </div>
     )
}