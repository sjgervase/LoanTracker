import React, { useEffect, useRef, useState } from "react";


// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import store actions
import { addLoan } from "../Redux/features/LoansSlice";

// import from react-bootstrap
import { Form, Button, Alert } from "react-bootstrap";

// import from currency field
import CurrencyInput from "react-currency-input-field";

// import from react-icons
import { TiEquals } from "react-icons/ti"; 

// import from react-router-dom
import { useNavigate } from "react-router-dom";

export default function AddALoan() {

     const dispatch = useDispatch();

     // get data from redux store
     // only loans are needed
     const loansState = useSelector((state) => state.loans);

     // read and generate unique GUIDS
     function guidGenerator() {
          
          // create empty array to be populated by all guids currently in the file
          let guidArray = [];

          // for each loan item
          for (let i = 0; i < loansState.loans.length; i++) {
               guidArray.push(loansState.loans[i].loan.GUID);
          }

          // generate 20 digit GUID for album and album art
          let randomGUID = (length = 20) => {
               let str = "";
               // create a GUID within a while loop. this will loop infinitely until a GUID is not already being used
               while (true) {
                    // Declare all characters
                    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                    // Pick characers randomly and add them to "str" variable to create random string
                    for (let i = 0; i < length; i++) {
                         str += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    // if str is not being used as a GUID already, break the while loop
                    if (!(guidArray.includes(str))) {
                         break;
                    }
               }
               return str;
          };
          return randomGUID();
     }



     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     const navigate = useNavigate();

     const [formState, setFormState] = useState({});

     // function to handle form item updates
     const handleChange = (value, name) => {
          setFormState({ ...formState, [name]: value })
     }



     // https://rangle.io/blog/simplifying-controlled-inputs-with-hooks/


     // set the default state to "Amortized Loan" bc the first option is student loan
     // this state dictates which version of the info form to show 
     const [loanTypeState, setLoanTypeState] = useState("");

     function loanTypeSelecton(value) {
          switch (value) {
               case 'Student Loan':
                    // set form state category and clear other properties of the form state, for if an end user selected one, started filling it out, then switched
                    setLoanTypeState("Amortized Loan");
                    setFormState({
                         LoanCategory: "Student Loan"
                    })
               break;

               case 'Mortgage':
                    setLoanTypeState("Amortized Loan");
                    setFormState({
                         LoanCategory: "Mortgage"
                    })
               break;

               case 'Auto Loan':
                    setLoanTypeState("Amortized Loan");
                    setFormState({
                         LoanCategory: "Auto Loan"
                    })
               break;

               case 'Personal Loan':
                    setLoanTypeState("Amortized Loan");
                    setFormState({
                         LoanCategory: "Personal Loan"
                    })
               break;

               case 'Credit Card':
                    setLoanTypeState("Revolving Debt"); 
                    setFormState({
                         LoanCategory: "Credit Card"
                    })
               break;

               default:
                    setFormState({});
               break;
          }
     }


     // state for holding the invalid field
     const [errorState, setErrorState] = useState({
          field: "",
          text: ""
     })

     // state for showing whether or not the form is submittable
     const [submittable, setSubmittable] = useState(true);


     // const isMounted = useRef(false);



     async function dataValidator() {
          // console.log("validating");

          // if loan name is blank or spaces
          if (formState.LoanName == undefined || formState.LoanName.match(/^ *$/) !== null) {
               // console.log("bad");
               setSubmittable(false);

               setErrorState({
                    field: "LoanName",
                    text: "Ensure the entered Loan Name is not blank or comprised of spaces"
               });
          
          // if monthly payment is blank or negative
          } else if(formState.MonthlyPayment == undefined || parseFloat(formState.MonthlyPayment) < 1) {
               setSubmittable(false);

               setErrorState({
                    field: "MonthlyPayment",
                    text: "Ensure the entered Monthly Payment is not blank, $0,  or a negative number"
               });

          // if term length is undefined or less than 1
          } else if(formState.TotalTermLength == undefined || parseInt(formState.TotalTermLength) < 1) {
               setSubmittable(false);

               setErrorState({
                    field: "TotalTermLength",
                    text: "Ensure the entered Total Term Length is not blank, 0, or a negative number"
               })
              
          // if interest rate is blank or negative
          } else if(formState.InterestRate == undefined || parseFloat(formState.InterestRate) < 1) {
               setSubmittable(false);

               setErrorState({
                    field: "InterestRate",
                    text: "Ensure the entered Interest Rate is not blank, 0, or a negative number"
               })
               

          // if disbursement date is blank
          } else if(formState.DisbursementDate == undefined) {
               setSubmittable(false);

               setErrorState({
                    field: "DisbursementDate",
                    text: "Ensure the entered Disbursement Date is not blank"
               })
               
          
          // if payment due date is blank or negative
          }  else if(formState.PaymentDate == undefined || parseFloat(formState.PaymentDate) < 1) {
               setSubmittable(false);

               setErrorState({
                    field: "PaymentDate",
                    text: "Ensure the entered Payment Date is not blank, 0, or a negative number"
               })


          // everything is valid
          } else {
               setSubmittable(true);

               setErrorState({
                    field: "",
                    text: ""
               })

               // get a GUID for this item
               let newGUID = guidGenerator();

               // dispatch the action with form state and GUID
               dispatch(addLoan({formState, newGUID}));


               // spin wheel until its done, ensuring the new data appears on the overview          
               // return to overview
               navigate('/');
          }
     }
     

     function cancel() {
          // add "are you sure" popup   https://react-bootstrap.github.io/components/modal/
          // return to overview
          navigate('/');
     }


     return(
          <div className="componentContainer">
               <h1 className="componentTitle">Add a New Loan</h1>

               <span>Fill out the fields below to add this loan to your total list of loans</span>

               <div className="loanInfoForm">

                    

                    {/* https://www.investopedia.com/terms/a/amortized_loan.asp */}
                    <Form.Group className="mb-3">
                         <Form.Label>Select the type of loan</Form.Label>
                         <Form.Select  name="LoanType" onChange={e => loanTypeSelecton(e.target.value)} >
                              <option>select a loan type</option>
                              <option>Student Loan</option>
                              <option>Mortgage</option>
                              <option>Auto Loan</option>
                              <option>Personal Loan</option>
                              <option>Credit Card</option>
                         </Form.Select>
                    </Form.Group>



                    {/* Amortized Loans */}
                    <div className={`loanTypes ${loanTypeState == "Amortized Loan" ? "showLoanTypes": ""}`}>
                         <Form>

                              {/* function to show alert */}
                              <Alert variant="danger" show={!submittable}>
                              <Alert.Heading>
                              Error
                              </Alert.Heading>
                              {errorState.text}
                              </Alert>


                              <div className="addALoanRequiredInfo dashboardModule">
                                   <div className="moduleHeader"><span>REQUIRED INFO</span></div>
                              
                                   {/* First Row */}
                                   <div className="formGroupRow">
                                        {/* Loan Name */}
                                        <Form.Group controlId="LoanName" className="loanNameDiv">
                                             <Form.Label>Loan Name</Form.Label>
                                             <Form.Control type="Text" name="LoanName" placeholder="Enter a name for this loan" className={`${errorState.field == "LoanName" ? "errorField": ""}`} 
                                             onChange={e => handleChange(e.target.value, e.target.name)} />
                                             <Form.Text className="text-muted">You can name it whatever you'd like. This is just for you to keep track of it</Form.Text>
                                        </Form.Group>

                                        {/* Color */}
                                        <Form.Group controlId="ColorPicker" className="colorPickerDiv">
                                             <Form.Label>Color picker</Form.Label>
                                             <Form.Control
                                             name="LoanColor"
                                             type="color"
                                             defaultValue="#000000"
                                             title="Choose your color"
                                             onChange={e => handleChange(e.target.value, e.target.name)}
                                             />
                                             <Form.Text className="text-muted">This color is for color-coded lists and graphs</Form.Text>
                                        </Form.Group>
                                   </div>

                                   {/* Second Row */}
                                   <div className="formGroupRow">
                                   
                                        {/* Monthly Payment */}
                                        <Form.Group controlId="MonthlyPayment" className="monthlyPaymentDiv">
                                             <Form.Label>Monthly Payment Amount</Form.Label>
                                             <CurrencyInput
                                                  prefix="$"
                                                  name="MonthlyPayment"
                                                  placeholder="ex $100"
                                                  decimalScale={2}
                                                  decimalsLimit={2}
                                                  allowNegativeValue={false}
                                                  onValueChange={(value, name) => handleChange(value, name)}
                                                  className={`${errorState.field == "MonthlyPayment" ? "errorField": ""}`}
                                             />
                                        </Form.Group>

                                        <div className="mathSymbol">
                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                  <path fill="currentColor" d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/>
                                             </svg>
                                        </div>

                                        {/* Total Term Length */}
                                        <Form.Group controlId="TotalTermLength" className="termLengthDiv">
                                             <Form.Label>Total Term Length (Months)</Form.Label>
                                             <Form.Control type="number" placeholder="ex 36" name="TotalTermLength" className={`${errorState.field == "TotalTermLength" ? "errorField": ""}`}
                                             onChange={e => handleChange(e.target.value, e.target.name)} />
                                             <Form.Text className="text-muted">The Total number of payments that will be made on this loan</Form.Text>
                                        </Form.Group>

                                        <div className="mathSymbol">
                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                  <path fill="currentColor" d="M48 192h352c17.69 0 32-14.32 32-32s-14.31-31.1-32-31.1h-352c-17.69 0-32 14.31-32 31.1S30.31 192 48 192zM400 320h-352c-17.69 0-32 14.31-32 31.1s14.31 32 32 32h352c17.69 0 32-14.32 32-32S417.7 320 400 320z"/>
                                             </svg>
                                        </div>

                                        {/* Principal Amount */}
                                        <Form.Group controlId="TotalLoanAmount" className="totalLoanAmountDiv">
                                             <Form.Label>Total Loan Amount</Form.Label>
                                             
                                             <h3>{(isNaN(parseFloat(formState.MonthlyPayment) * parseFloat(formState.TotalTermLength))) ? "---" : moneyFormatter(parseFloat(formState.MonthlyPayment) * parseFloat(formState.TotalTermLength))}</h3>
                                        </Form.Group>
                                   </div>

                                   {/* Third Row */}
                                   <div className="formGroupRow">
                                        {/* Interest Rate */}
                                        <Form.Group controlId="InterestRate" className="interestRateDiv">
                                             <Form.Label>Interest Rate</Form.Label>
                                             <CurrencyInput
                                                  suffix="%"
                                                  name="InterestRate"
                                                  placeholder="ex 3%"
                                                  decimalScale={2}
                                                  decimalsLimit={2}
                                                  allowNegativeValue={false}
                                                  onValueChange={(value, name) => handleChange(value, name)}
                                                  className={`${errorState.field == "InterestRate" ? "errorField": ""}`}
                                             />
                                        </Form.Group>

                                        {/* Disbursement Date */}
                                        <Form.Group controlId="DisbursementDate" className="disbursementDateDiv">
                                             <Form.Label>Disbursement Date</Form.Label>
                                             <Form.Control type="date" name="DisbursementDate" className={`${errorState.field == "DisbursementDate" ? "errorField": ""}`}
                                             onChange={e => handleChange(e.target.value, e.target.name)} />
                                             <Form.Text className="text-muted">This is the date the loan began</Form.Text>
                                        </Form.Group>

                                        {/* Payment Date */}
                                        <Form.Group controlId="PaymentDate" className="termLengthDiv">
                                             <Form.Label>Payment Due Date</Form.Label>

                                             <CurrencyInput
                                                  name="PaymentDate"
                                                  placeholder="3"
                                                  allowDecimals={false}
                                                  allowNegativeValue={false}
                                                  step={1}
                                                  min={1}
                                                  max={31}
                                                  maxLength={2}
                                                  onValueChange={(value, name) => handleChange(value, name)}
                                                  className={`${errorState.field == "PaymentDate" ? "errorField": ""}`}
                                             />
                                             <Form.Text className="text-muted">The day you pay the bill. If you pay on the 18th of each month, enter 18</Form.Text>
                                        </Form.Group> 
                                   </div>
                              </div>



                              <span className="formGroupLegend">OPTIONAL INFO</span>
                              <div className="formGroupDiv">

                                   {/* First Row */}
                                   <div className="formGroupRow">
                                        
                                        {/* Loan Link */}
                                        <Form.Group controlId="LoanLink" className="loanLinkDiv">
                                             <Form.Label>Loan Link</Form.Label>
                                             <Form.Control type="Text" name="LoanLink" placeholder="enter the link for the loan's site" 
                                             onChange={e => handleChange(e.target.value, e.target.name)} />
                                             <Form.Text className="text-muted">This is for quick access to make payments</Form.Text>
                                        </Form.Group>

                                   </div>

                                   {/* Second Row*/}
                                   <div className="formGroupRow">
                                        {/* Amount Remaining */}
                                        <Form.Group controlId="OutstandingBalance" className="remainingAmountDiv">
                                             <Form.Label>Outstanding / Current Balance</Form.Label>
                                             <CurrencyInput
                                                  prefix="$"
                                                  name="OutstandingBalance"
                                                  placeholder="ex $10,000"
                                                  decimalScale={2}
                                                  decimalsLimit={2}
                                                  onValueChange={(value, name) => handleChange(value, name)}
                                             />
                                        </Form.Group>

                                        {/* Remaining Term Length */}
                                        <Form.Group controlId="RemainingTermLength" className="termLengthDiv">
                                             <Form.Label>Remaining Term Length (Months)</Form.Label>
                                             <Form.Control type="number" placeholder="ex 36" name="RemainingTermLength"
                                             onChange={e => handleChange(e.target.value, e.target.name)} />
                                        </Form.Group>

                                   </div>

                              </div>

                              <Button variant="success"
                              onClick={() => dataValidator()}>
                                   Submit
                              </Button>

                              <Button variant="outline-danger" type="cancel"
                              onClick={() => cancel()}>
                                   Cancel
                              </Button>

                         </Form>
                    </div>

               </div>


                    

          </div>
          
     )
}