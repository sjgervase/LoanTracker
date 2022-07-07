import React, { useEffect, useState } from "react";

// import from react-bootstrap
import { Form, ButtonGroup, ToggleButton, OverlayTrigger, Popover } from "react-bootstrap";

// import react icons
import { FaInfoCircle, FaCheckCircle, FaRegCircle } from "react-icons/fa";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import store actions
import { addFieldToFormData, errorsExist, validationMode, repaymentOptionData } from "../../../Redux/features/AddALoanSlice";

import BigNumber from "bignumber.js";

// import from currency field
import CurrencyInput from "react-currency-input-field";

// import tranistion
import { CSSTransition } from "react-transition-group";


export default function RepaymentOptions() {

     const dispatch = useDispatch();

     const formState = useSelector(state => state.addaloan);

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);


     // state and function to handle the repayment option radio button selection
     const [radioState, setRadioState] = useState("paybackFromTotal");

     // dispatch the action to set the default radio state in the form data
     useEffect(() => {
          dispatch(addFieldToFormData({RepaymentOption:"paybackFromTotal"}));
     }, [])
     
     // handle the change of the radio buttons
     const handleRadioChange = (value) => {
          // set the state so the proper fields are visible
          setRadioState(value);

          // dispatch the action to the store
          dispatch(repaymentOptionData({RepaymentOption:value}));
     }

     // loanTypeRadios is an array of objects to quickly map loan types
     const repaymentTypeRadios = [
          {
               name: 'Payback From Total Loan Amount',
               value: 'paybackFromTotal',
               popoverText: 'This option will calculate the total amount you will pay for this loan. This can be beneficial for internally calculated interest payments and more accurate payback graphs and data, but will require you to enter all previous payments to be up-to-date.'
          },

          {
               name: 'Payback from Current Loan Amount',
               value: 'paybackFromCurrent',
               popoverText: 'This option will let you avoid entering many old payments, which is beneficial if you have an older loan. this option may have a miniscule effect on interest amounts, as some loan holders may or may not include interest when viewing the current loan amount. You will also need to know exactly how many payments are remaining in you loan plan.'
          }
     ];




     // function to handle changes to form fields
     const handleChange = (name, value) => {
          // dispatch the action to the store
          dispatch(addFieldToFormData({[name]:value}));
     }



     // function to calculate the total loan amount
     const calculateTotalLoanAmount = () => {
          // if either of the current values are NaN, return filler text
          
          if (isNaN(parseFloat(formState.formData.MonthlyPayment)) || isNaN(parseFloat(formState.formData.TotalTermLength))) {
               return "---"
          
          // perfom calculations with bignumber as these may be floating point
          } else {
               let monthlyPayment = new BigNumber(formState.formData.MonthlyPayment);
               let totalTermLength = new BigNumber(formState.formData.TotalTermLength);
               let totalLoanAmount = monthlyPayment.multipliedBy(totalTermLength).toFixed(2)
               return totalLoanAmount;
          }
     }




     // function to calculate remaining periods
     const calculateRemainingPeriods = () => {

          
          // ensure fields are filled 
          if (isNaN(formState.formData.MonthlyPayment) || isNaN(formState.formData.PresentValue) || isNaN(formState.formData.InterestRate)) {
               return '---';
          } else {
               // https://financeformulas.net/Loan_Payment_Formula.html
               let monthlyPayment = new BigNumber(formState.formData.MonthlyPayment);
               let presentValue = new BigNumber(formState.formData.PresentValue);
               let interestRate = new BigNumber(formState.formData.InterestRate);

               // divide your annual interest rate by 12 to calculate your monthly interest rate
               let interestRatePerPeriod = interestRate.dividedBy(100).dividedBy(12);

               // https://www.sapling.com/8609716/calculate-months-pay-off-loan
               // step 4 from above link
               let numerator = presentValue.multipliedBy(interestRatePerPeriod).dividedBy(monthlyPayment);

               //step 5 from above link
               let one_bignumber = new BigNumber(1);

               numerator = one_bignumber.minus(numerator);
               let demominator = one_bignumber.plus(interestRatePerPeriod);

               // step 6 & 7 from above link
               let finalNumerator = new BigNumber(Math.log(numerator.toNumber()));
               let finalDenominator = new BigNumber(Math.log(demominator.toNumber()));

               // step 8 from above link
               let finalResult = finalNumerator.dividedBy(finalDenominator).multipliedBy(-1);
               let formattedResult = Math.ceil(finalResult.toNumber());

               return formattedResult;
          }
     }

     // get the calculated amount in the form state OR the calculated remaining periods
     useEffect(() => {

          // if using payback from total
          if (radioState === 'paybackFromTotal') {
               // for function to calculate total loan amount
               let CalculatedTotalLoanAmount = calculateTotalLoanAmount();

               if (CalculatedTotalLoanAmount !== '---') {
                    dispatch(addFieldToFormData({TotalLoanAmount:CalculatedTotalLoanAmount}));
               }
               
          // else current
          } else {
               // for function to calculate total loan amount
               let CalculatedRemainingPeriods = calculateRemainingPeriods();

               if (CalculatedRemainingPeriods !== '---') {
                    dispatch(addFieldToFormData({TotalTermLength:CalculatedRemainingPeriods}));
               }
          }

     }, [formState])



     // error handling
     const [errorFields, setErrorFields] = useState([])
     // useEffect to watch the formstate.validate property. when true, all form components should validate their own fields
     useEffect(() => {
          if (formState.validate) {
               console.log("validate now");
               // empty arrays to be populated if the fields are erroneous
               let errorFieldsArray = [];
               // if interest rate is blank (field forces positive numbers)
               if(formState.formData.InterestRate == undefined || formState.formData.InterestRate == "") {
                    // push the erroneous field name to array
                    errorFieldsArray.push("InterestRate");
               }

               // the only data that is captured (and validate) are the fields attached to the radio selection
               if (radioState == "paybackFromTotal") {                    
                    // if monthly payment is undefined
                    if (formState.formData.MonthlyPayment == undefined || formState.formData.MonthlyPayment == "") {
                         // push the erroneous field name to array
                         errorFieldsArray.push("MonthlyPayment");
                    }
                    // if total term length is empty
                    if (formState.formData.TotalTermLength == undefined || formState.formData.TotalTermLength == "") {
                         // push the erroneous field name to array
                         errorFieldsArray.push("TotalTermLength");
                    }
               // payback from current selected
               } else {
                    // if monthly payment is undefined
                    if (formState.formData.MonthlyPayment == undefined || formState.formData.MonthlyPayment == "") {
                         // push the erroneous field name to array
                         errorFieldsArray.push("MonthlyPayment");
                    }
                    // if present value is undefined
                    if (formState.formData.PresentValue == undefined || formState.formData.PresentValue == "") {
                         // push the erroneous field name to array
                         errorFieldsArray.push("PresentValue");
                    }
               }

               // set the error fields state to the array
               setErrorFields(errorFieldsArray);
               // if there are errors, dispatch action
               if (errorFieldsArray.length > 0) {
                    dispatch(errorsExist(true))
               } else {
                    dispatch(errorsExist(false))
               }
               // exit validation mode
               dispatch(validationMode(false))
          }
     }, [formState.validate])



      // Overlay triggers listed as consts to keep return easier to read
      const totalLoanAmountOverlay = (
          <OverlayTrigger
          placement="top"
          overlay={
               <Popover id="popover-basic" className="customPopover">
                    <Popover.Header as="h3" className="customPopoverHeader">Total Loan Amount</Popover.Header>
                    <Popover.Body className="customPopoverBody">
                         <span>
                              What is this number?
                              <br></br>
                              Because you selected to "Payback from Total" above, the form will automatically calculate the exact amount of money you will pay for this loan. Loan Statements might display a different number, but that is because they are showing the present value, without interest applied.
                              <br></br>
                              <strong>This is exactly how much money you will pay over the course of the loan, and it is calculated by multiplying your minimum payment by your total payments.</strong>
                         </span>
                    </Popover.Body>
               </Popover>
          }>
               <div className="addALoanHelpOverlay">
                    <FaInfoCircle/>
               </div>
          </OverlayTrigger>
     );

     const presentValueOverlay = (
          <OverlayTrigger
          placement="top"
          overlay={
               <Popover id="popover-basic" className="customPopover">
                    <Popover.Header as="h3" className="customPopoverHeader">Function to Calculate Remaining Loan Periods</Popover.Header>
                    <Popover.Body className="customPopoverBody">
                         <span>
                              This is the current value of the loan.
                         </span>
                    </Popover.Body>
               </Popover>
          }>
               
               <div className="addALoanHelpOverlay">
                    <FaInfoCircle/>
               </div>
          </OverlayTrigger>
     );

     const calculateRemainingPeriodsOverlay = (
          <OverlayTrigger
          placement="top"
          overlay={
               <Popover id="popover-basic" className="customPopover">
                    <Popover.Header as="h3" className="customPopoverHeader">Function to Calculate Remaining Loan Periods</Popover.Header>
                    <Popover.Body className="customPopoverBody">
                         <span>
                              The full function is:

                              <div className="loanEquation">
                                   <div className="loanEquationEquals">
                                        <span>N = –</span>
                                   </div>

                                   <div className="loanEquationBody">
                                        <div className="loanEquationNumerator">
                                             <span>ln( 1 – (( PV * i ) / PMT ))</span>
                                        </div>

                                        <div className="loanEquationDenominator">
                                             <span>ln( 1 + i )</span>
                                        </div>
                                   </div>
                              </div>
                              
                              Where:
                              <ul>
                                   <li>N = the number of months remaining</li>
                                   <li>PV = present value, or outstanding loan balance</li>
                                   <li>PMT = monthly payment</li>
                                   <li>i = monthly interest rate (as a decimal)</li>
                                   <li>ln = Natural logarithm</li>
                              </ul>
                              Isn't that fun?
                         </span>
                    </Popover.Body>
               </Popover>
          }>
               
               <div className="mathSymbol mathSymbolCalc">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                         <path fill="currentColor" d="M336 0h-288C22.38 0 0 22.38 0 48v416C0 489.6 22.38 512 48 512h288c25.62 0 48-22.38 48-48v-416C384 22.38 361.6 0 336 0zM64 208C64 199.2 71.2 192 80 192h32C120.8 192 128 199.2 128 208v32C128 248.8 120.8 256 112 256h-32C71.2 256 64 248.8 64 240V208zM64 304C64 295.2 71.2 288 80 288h32C120.8 288 128 295.2 128 304v32C128 344.8 120.8 352 112 352h-32C71.2 352 64 344.8 64 336V304zM224 432c0 8.801-7.199 16-16 16h-128C71.2 448 64 440.8 64 432v-32C64 391.2 71.2 384 80 384h128c8.801 0 16 7.199 16 16V432zM224 336c0 8.801-7.199 16-16 16h-32C167.2 352 160 344.8 160 336v-32C160 295.2 167.2 288 176 288h32C216.8 288 224 295.2 224 304V336zM224 240C224 248.8 216.8 256 208 256h-32C167.2 256 160 248.8 160 240v-32C160 199.2 167.2 192 176 192h32C216.8 192 224 199.2 224 208V240zM320 432c0 8.801-7.199 16-16 16h-32c-8.799 0-16-7.199-16-16v-32c0-8.801 7.201-16 16-16h32c8.801 0 16 7.199 16 16V432zM320 336c0 8.801-7.199 16-16 16h-32c-8.799 0-16-7.199-16-16v-32C256 295.2 263.2 288 272 288h32C312.8 288 320 295.2 320 304V336zM320 240C320 248.8 312.8 256 304 256h-32C263.2 256 256 248.8 256 240v-32C256 199.2 263.2 192 272 192h32C312.8 192 320 199.2 320 208V240zM320 144C320 152.8 312.8 160 304 160h-224C71.2 160 64 152.8 64 144v-64C64 71.2 71.2 64 80 64h224C312.8 64 320 71.2 320 80V144z"/>
                    </svg>                   
               </div>
          </OverlayTrigger>
     );


     return (
          <div className="addALoanRepaymentInfo dashboardModule">
               <div className="moduleHeader">
                    <h2>Repayment Options</h2>
               </div>

               {/* Payback Choice Radio buttons */}
               <div className="formGroupRow paybackChoiceDiv">
                    <div className="moduleContent repaymentOptionContent">
                         {repaymentTypeRadios.map((radio, idx) => (
                              <OverlayTrigger key={`repaymentOptionButtonGroupWithOverlay-${idx}`}
                              placement="top"
                              overlay={
                                   <Popover id="popover-basic" className="customPopover">
                                        <Popover.Header as="h3" className="customPopoverHeader">{radio.name}</Popover.Header>
                                        <Popover.Body className="customPopoverBody">
                                             <span>{radio.popoverText}</span>
                                        </Popover.Body>
                                   </Popover>
                              }>
                                   <div className="addALoanHelpOverlay">              
                                        <ButtonGroup className="mb-2 repaymentOptionButtonGroup">  
                                             <ToggleButton
                                             id={`repaymentRadio-${idx}`}
                                             type="radio"
                                             variant="outline-success"
                                             name="repaymentRadio"
                                             value={radio.value}
                                             checked={radioState === radio.value}
                                             onChange={e => handleRadioChange(e.target.value)}>

                                             <div className="radioButtonContainer">
                                                  <div className="radioButtonIcons">
                                                       <CSSTransition
                                                       in={radioState !== radio.value ? true : false}
                                                       timeout={150}
                                                       unmountOnExit
                                                       classNames="radioButtonUncheckAnimation">
                                                            <FaRegCircle className="radioButtonUnchecked"/>
                                                       </CSSTransition>
     
                                                       <CSSTransition
                                                       in={radioState === radio.value ? true : false}
                                                       timeout={150}
                                                       unmountOnExit
                                                       classNames="radioButtonCheckAnimation">
                                                            <FaCheckCircle className="radioButtonChecked"/>
                                                       </CSSTransition>
                                                  </div>
                                                  <h5 className="radioButtonTitle">{radio.name}</h5>
                                             </div>
                                             </ToggleButton>
                                        </ButtonGroup>
                                   </div>
                              </OverlayTrigger>
                         ))}
                    </div>
               </div>


               <div className="formGroupRow">
                    {/* Interest Rate */}
                    <Form.Group controlId="InterestRate" className="interestRateDiv">
                         <Form.Label>Interest Rate</Form.Label>
                         <CurrencyInput
                              suffix="%"
                              name="InterestRate"
                              placeholder="ex 4%"
                              decimalScale={2}
                              decimalsLimit={2}
                              allowNegativeValue={false}
                              className={`form-control ${formState.errors && errorFields.includes("InterestRate") ? "is-invalid" : ""}`}
                              onValueChange={(value, name) => handleChange(name, value)}
                         />
                         <div className="invalid-feedback">Ensure Interest Rate is not blank</div>
                    </Form.Group>
               </div>
               

               <div className="paybackFieldsAnimationParent">
                    {/* Payback from Total Fields */}
                    <CSSTransition
                    in={radioState === "paybackFromTotal" ? true : false}
                    timeout={300}
                    unmountOnExit
                    classNames="paybackFromTotalFields">
                         <div className="formGroupRow paybackFieldsTotal">
                              <div className="repaymentOptions">

                                   {/* Monthly Payment */}
                                   <Form.Group controlId="MonthlyPayment" className="monthlyPaymentDiv">
                                        <Form.Label>Minimum Monthly Payment Amount</Form.Label>
                                        <CurrencyInput
                                             prefix="$"
                                             name="MonthlyPayment"
                                             placeholder="ex $100"
                                             decimalScale={2}
                                             decimalsLimit={2}
                                             allowNegativeValue={false}
                                             className={`form-control ${formState.errors && errorFields.includes("MonthlyPayment") ? "is-invalid" : ""}`}
                                             onValueChange={(value, name) => handleChange(name, value)}
                                        />
                                        <div className="invalid-feedback">Ensure Minimum Monthly Payment is not blank</div>
                                   </Form.Group>

                                   <div className="mathSymbol mathSymbolMultiply">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                             <path fill="currentColor" d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/>
                                        </svg>
                                   </div>

                                   {/* Total Term Length */}
                                   <Form.Group controlId="TotalTermLength" className="termLengthDiv">
                                        <Form.Label>Total Number of Payments</Form.Label>
                                        <CurrencyInput
                                             name="TotalTermLength"
                                             placeholder="ex 60"
                                             allowDecimals={false}
                                             allowNegativeValue={false}
                                             className={`form-control ${formState.errors && errorFields.includes("TotalTermLength") ? "is-invalid" : ""}`}
                                             onValueChange={(value, name) => handleChange(name, value)}
                                        />
                                        <div className="invalid-feedback">Ensure Total Term Length is not blank</div>
                                   </Form.Group>
                              </div>

                              <div className="mathSymbol mathSymbolEquals">
                                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path fill="currentColor" d="M48 192h352c17.69 0 32-14.32 32-32s-14.31-31.1-32-31.1h-352c-17.69 0-32 14.31-32 31.1S30.31 192 48 192zM400 320h-352c-17.69 0-32 14.31-32 31.1s14.31 32 32 32h352c17.69 0 32-14.32 32-32S417.7 320 400 320z"/>
                                   </svg>
                              </div>

                              {/* Principal Amount */}
                              <div className="totalLoanAmountDiv">
                                   <h4 className="totalLoanAmountTitle">Total Loan Amount {totalLoanAmountOverlay}</h4>
                                   <h3>{isNaN(calculateTotalLoanAmount()) ? "---" : moneyFormatter(calculateTotalLoanAmount())}</h3>
                              </div>
                         </div>
                    </CSSTransition>


                    {/* Payback from Current Fields */}
                    <CSSTransition
                    in={radioState === "paybackFromCurrent" ? true : false}
                    timeout={300}
                    unmountOnExit
                    classNames="paybackFromCurrentFields">
                         <div className="formGroupRow paybackFieldsCurrent">
                              <div className="repaymentOptions">
                              
                                   {/* Monthly Payment */}
                                   <Form.Group controlId="MonthlyPayment" className="monthlyPaymentDiv">
                                        <Form.Label>Minimum Monthly Payment Amount</Form.Label>
                                        <CurrencyInput
                                             prefix="$"
                                             name="MonthlyPayment"
                                             placeholder="ex $100"
                                             decimalScale={2}
                                             decimalsLimit={2}
                                             allowNegativeValue={false}
                                             className={`form-control ${formState.errors && errorFields.includes("MonthlyPayment") ? "is-invalid" : ""}`}
                                             onValueChange={(value, name) => handleChange(name, value)}
                                        />
                                        <div className="invalid-feedback">Ensure Minimum Monthly Payment is not blank</div>
                                   </Form.Group>

                                   {calculateRemainingPeriodsOverlay}

                                   {/* Total Term Length */}
                                   <Form.Group controlId="PresentValue" className="presentValueDiv">
                                        <div className="addALoanFormLabel">
                                             <Form.Label>Present Value</Form.Label>
                                             {presentValueOverlay}
                                        </div>
                                        <CurrencyInput
                                             name="PresentValue"
                                             prefix="$"
                                             placeholder="ex $10,000"
                                             allowNegativeValue={false}
                                             className={`form-control ${formState.errors && errorFields.includes("PresentValue") ? "is-invalid" : ""}`}
                                             onValueChange={(value, name) => handleChange(name, value)}
                                        />
                                        <div className="invalid-feedback">Ensure Present Value is not blank</div>
                                   </Form.Group>
                              </div>

                              <div className="mathSymbol mathSymbolEquals">
                                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path fill="currentColor" d="M48 192h352c17.69 0 32-14.32 32-32s-14.31-31.1-32-31.1h-352c-17.69 0-32 14.31-32 31.1S30.31 192 48 192zM400 320h-352c-17.69 0-32 14.31-32 31.1s14.31 32 32 32h352c17.69 0 32-14.32 32-32S417.7 320 400 320z"/>
                                   </svg>
                              </div>

                              {/* Principal Amount */}
                              <div className="totalLoanAmountDiv">
                                   <h4 className="totalLoanAmountTitle">Remaining Periods</h4>
                                   <h3>{calculateRemainingPeriods()}</h3>
                              </div>
                         </div>
                    </CSSTransition>
               </div>
          </div>
     )
}