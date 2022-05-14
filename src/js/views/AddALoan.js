import React, { useEffect, useState } from "react";

// import from electron
import { ipcRenderer } from "electron";

// import from react-bootstrap
import { Form, Button } from "react-bootstrap";

// import from currency field
import CurrencyInput from "react-currency-input-field";

// import from react-icons
import { TiEquals } from "react-icons/ti"; 

// import from react-router-dom
import { useNavigate } from "react-router-dom";

export default function AddALoan() {

     const navigate = useNavigate();

     const [formState, setFormState] = useState({
          LoanCategory: "",
          LoanType: "",
          LoanName: "",
          RemainingAmount: "",
          MonthlyPayment: "",
          PaymentDate: "",
          InterestRate: "",
          RemainingTermLength: "",
          PrincipalAmount: "",
          TotalTermLength:"",
          LoanLink: "",
          DisbursementDate: "",
          LoanColor: ""
     });

     function handleChange(value, fieldName) {
          // create a variable equal to the current state
          let formStateInstance = formState;

          // console.log(value);
          // console.log(fieldName);

          // set the variable's field equal to the recieved value
          formStateInstance[fieldName] = value;

          // set the state object equal to the new item
          // this will preserve previous items
          setFormState({
               LoanCategory: formStateInstance.LoanCategory,
               LoanType: loanTypeState,
               LoanName: formStateInstance.LoanName,
               RemainingAmount: formStateInstance.RemainingAmount,
               MonthlyPayment: formStateInstance.MonthlyPayment,
               PaymentDate: formStateInstance.PaymentDate,
               InterestRate: formStateInstance.InterestRate,
               RemainingTermLength: formStateInstance.RemainingTermLength,
               PrincipalAmount: formStateInstance.PrincipalAmount,
               TotalTermLength: formStateInstance.TotalTermLength,
               DisbursementDate: formStateInstance.DisbursementDate,
               LoanLink: formStateInstance.LoanLink,
               LoanColor: formStateInstance.LoanColor
          })
          
     }


     // https://rangle.io/blog/simplifying-controlled-inputs-with-hooks/


     // set the default state to "Amortized Loan" bc the first option is student loan
     // this state dictates which version of the info form to show 
     const [loanTypeState, setLoanTypeState] = useState("");

     function loanTypeSelecton(value) {
          switch (value) {
               case 'Student Loan':
                    setLoanTypeState("Amortized Loan");
                    // set form state category and clear other properties of the form state, for if an end user selected one, started filling it out, then switched
                    setFormState({LoanCategory:"Student Loan", LoanType: "", LoanName: "", RemainingAmount: "", MonthlyPayment:"", PaymentDate:"", InterestRate: "", RemainingTermLength: "", PrincipalAmount: "", TotalTermLength:"", DisbursementDate: "", LoanLink: "", LoanColor: ""})
               break;

               case 'Mortgage':
                    setLoanTypeState("Amortized Loan");
                    setFormState({LoanCategory:"Mortgage",LoanType: "", LoanName: "", RemainingAmount: "", MonthlyPayment:"", PaymentDate:"", InterestRate: "", RemainingTermLength: "", PrincipalAmount: "", TotalTermLength:"", LoanLink: "",  DisbursementDate: "", LoanColor: ""})
               break;

               case 'Auto Loan':
                    setLoanTypeState("Amortized Loan");
                    setFormState({LoanCategory:"Auto Loan", LoanType: "", LoanName: "", RemainingAmount: "", MonthlyPayment:"", PaymentDate:"", InterestRate: "", RemainingTermLength: "", PrincipalAmount: "", TotalTermLength:"", LoanLink: "",  DisbursementDate: "", LoanColor: ""})
               break;

               case 'Personal Loan':
                    setLoanTypeState("Amortized Loan");
                    setFormState({LoanCategory:"Personal Loan", LoanType: "", LoanName: "", RemainingAmount: "", MonthlyPayment:"",  InterestRate: "", RemainingTermLength: "", PrincipalAmount: "", TotalTermLength:"", LoanLink: "",  DisbursementDate: "", LoanColor: ""})
               break;

               case 'Credit Card':
                    setLoanTypeState("Revolving Debt");
                    setFormState({LoanCategory:"Credit Card", LoanType: "", LoanName: "", RemainingAmount: "", MonthlyPayment:"",  InterestRate: "", RemainingTermLength: "", PrincipalAmount: "", TotalTermLength:"", LoanLink: "", DisbursementDate: "",  LoanColor: ""})
               break;

               default:
                    setLoanTypeState("");
               break;
          }
     }




     function submission() {
          // console.log(formState);
          // validate data (no negatives, etc)
          
          // invoke main process to write data to file       https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
          ipcRenderer.invoke('newLoanSubmission', (formState));
          
          // spin wheel until its done, ensuring the new data appears on the overview
          
          // return to overview
          navigate('/');

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

                              

                              

                              <span className="formGroupLegend">REQUIRED INFO</span>
                              <div className="formGroupDiv">

                                   {/* First Row */}
                                   <div className="formGroupRow">
                                        {/* Loan Name */}
                                        <Form.Group controlId="LoanName" className="loanNameDiv">
                                             <Form.Label>Loan Name</Form.Label>
                                             <Form.Control type="Text" name="LoanName" placeholder="Enter a name for this loan" 
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
                                                  onValueChange={(value, name) => handleChange(value, name)}
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
                                             <Form.Control type="number" placeholder="ex 36" name="TotalTermLength"
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
                                             <CurrencyInput
                                                  prefix="$"
                                                  name="TotalLoanAmount"
                                                  placeholder="ex $10,000"
                                                  decimalScale={2}
                                                  decimalsLimit={2}
                                                  value={formState.MonthlyPayment * formState.TotalTermLength}
                                                  onValueChange={(value, name) => handleChange(value, name)}
                                             />
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
                                                  onValueChange={(value, name) => handleChange(value, name)}
                                             />
                                        </Form.Group>

                                        {/* Payment Date */}
                                        <Form.Group controlId="PaymentDate" className="termLengthDiv">
                                             <Form.Label>Payment Due Date</Form.Label>
                                             <Form.Control type="number" name="PaymentDate" placeholder="ex 18"
                                             onChange={e => handleChange(e.target.value, e.target.name)} />
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
                                        <Form.Group controlId="RemainingAmount" className="remainingAmountDiv">
                                             <Form.Label>Amount Remaining</Form.Label>
                                             <CurrencyInput
                                                  prefix="$"
                                                  name="RemainingAmount"
                                                  placeholder="ex $10,000"
                                                  decimalScale={2}
                                                  decimalsLimit={2}
                                                  onValueChange={(value, name) => handleChange(value, name)}
                                             />
                                        </Form.Group>

                                        {/* Disbursement Date */}
                                        <Form.Group controlId="DisbursementDate" className="disbursementDateDiv">
                                             <Form.Label>DisbursementDate</Form.Label>
                                             <Form.Control type="date" name="DisbursementDate"
                                             onChange={e => handleChange(e.target.value, e.target.name)} />
                                             <Form.Text className="text-muted">This is the date the loan began</Form.Text>
                                        </Form.Group>

                                        {/* Remaining Term Length */}
                                        <Form.Group controlId="RemainingTermLength" className="termLengthDiv">
                                             <Form.Label>Remaining Term Length (Months)</Form.Label>
                                             <Form.Control type="number" placeholder="ex 36" name="RemainingTermLength"
                                             onChange={e => handleChange(e.target.value, e.target.name)} />
                                        </Form.Group>

                                   </div>

                              </div>

                              <Button variant="success" type="submit"
                              onClick={() => submission()}>
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