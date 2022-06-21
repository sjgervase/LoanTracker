import React, { useEffect, useRef, useState } from "react";


// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import store actions
import { addLoan } from "../Redux/features/LoansSlice";

// import from react-bootstrap
import { Form, Button, Alert, ButtonGroup, ToggleButton, OverlayTrigger, Popover } from "react-bootstrap";

// import from currency field
import CurrencyInput from "react-currency-input-field";

import BigNumber from "bignumber.js";

// import from react-icons
import { AiFillCar, AiFillHome } from "react-icons/ai"; 
import { FaGraduationCap, FaUser, FaCreditCard, FaInfoCircle, FaCalculator, FaCar } from "react-icons/fa";

// import from react-router-dom
import { useNavigate } from "react-router-dom";

// import tranistion
import { CSSTransition } from "react-transition-group";

export default function AddALoan() {

     const dispatch = useDispatch();

     // random color generator for colorpicker
     const colorGenerator = () => {
          var result = '';
          var characters = 'ABCDEF0123456789';
          var charactersLength = characters.length;

          for (var i = 0; i < 6; i++) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }

          result = "#" + result;
          return result;
     }


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


     const [radioState, setRadioState] = useState("paybackFromTotal");
     // function to handle the radio button selection
     const handleRadioChange = (value) => {
          setRadioState(value);
     }


     // state to ensure the formatting of the payment date
     const [paymentDateState, setPaymentDateState] = useState("---");

     // function to verify the payment date
     const paymentDateVerifier = (value) => {

          // ensure a number
          let formattedValue = value.replace(/\D/g, "");

          // if the new value is more than 0 or less than 32 or blank, allow it 
               // blank bc the user may delete the default value to enter their own
          if (formattedValue > 0 && formattedValue < 32 || formattedValue == "") {
               // set the form state value
               setFormState({ ...formState, "PaymentDate": value });

               setPaymentDateState(formattedValue)
          }
     }

     // function to have the proper ordinal next to the payment date
     function nextDateGenerator() {
          let ordinal;

          // if not a number, return blank
          if (isNaN(paymentDateState) || paymentDateState === "") {
               ordinal = ""
               
          } else {

               // create empty object to be populated below, for only one return option from this function
               let returnObjStrings = {};

               // get the todays date number 
               let today = new Date();
               let dd = String(today.getDate()).padStart(2, '0'); // gets the day

               // array of all month names to return
               const monthNames = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"
               ];

               // create array of all day names to return
               var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];



               // return proper ordinal
               if (paymentDateState > 3 && paymentDateState < 21) {
                    ordinal = "th";
               } else {
                    switch (paymentDateState % 10) {
                         case 1: ordinal = "st"; break;
                         case 2: ordinal = "nd"; break;
                         case 3: ordinal = "rd"; break;
                         default: ordinal = "th"; break;
                    }
               }

               // calculate the difference in days
               let dateDiff = parseInt(paymentDateState) - parseInt(dd);

               if (dateDiff > 0) {
                    // its due this month, easy calculation
                    // ex due in 6 days

                    // set the date value to the day of payment
                    today.setDate(paymentDateState);
                    
                    // set return objects
                    returnObjStrings.monthName = monthNames[today.getMonth()];
                    returnObjStrings.dayName = days[today.getDay()];
                    returnObjStrings.daysTilPayment = dateDiff;
               
               } else {
                    // due next month
                    // get next month from todays 
                    var nextMonthDate = new Date(today.setMonth(today.getMonth()+1));

                    // get the payment date of next month
                    nextMonthDate.setDate(paymentDateState);

                    // ensure it doesnt break in december as january might be 0
                    let timeDifferenceMS = nextMonthDate - new Date();

                    // convert ms to days
                    let timeDiffDays = timeDifferenceMS/(1000*60*60*24);

                    // set return objects
                    returnObjStrings.monthName = monthNames[nextMonthDate.getMonth()];
                    returnObjStrings.dayName = days[nextMonthDate.getDay()];
                    returnObjStrings.daysTilPayment = timeDiffDays;
               }

               return(
                    <div className="nextPaymentReturn">
                         <h6>Is this Correct?</h6>
                         <span>
                              Your next payment is due in {returnObjStrings.daysTilPayment} {returnObjStrings.daysTilPayment === 1 ? "day" : "days"} on {returnObjStrings.dayName}, {returnObjStrings.monthName} {paymentDateState}{ordinal}
                         </span>
                    </div>
               );
          }

     }


     // loanTypeRadios is an array of objects to quickly map loan types
     const loanTypeRadios = [
          {
               name: 'Student Loan',
               img: <FaGraduationCap/>,
               value: 'StudentLoan'
          },

          {
               name: 'Mortgage',
               img: <AiFillHome/>,
               value: 'Mortgage'
          },

          {
               name: 'Vehicle Loan',
               img: <FaCar/>,
               value: 'VehicleLoan'
          },

          {
               name: 'Personal Loan',
               img: <FaUser/>,
               value: 'PersonalLoan'
          },

          {
               name: 'Credit Card',
               img: <FaCreditCard/>,
               value: 'CreditCard'
          }
     ];



     // set the default state to "Amortized Loan" bc the first option is student loan
     // initially hide the AmortizedLoanForm
     const [showAmortizedLoanForm, setShowAmortizedLoanForm] = useState(false);

     function loanTypeSelection(value) {
          switch (value) {
               case 'StudentLoan':
                    // set the form type to true to reveal with react transition group
                    setShowAmortizedLoanForm(true);

                    // set the form state to the selected button
                    setFormState({
                         LoanCategory: "StudentLoan"
                    })
               break;

               case 'Mortgage':
                    // set the form type to true to reveal with react transition group
                    setShowAmortizedLoanForm(true);

                    setFormState({
                         LoanCategory: "Mortgage"
                    })
               break;

               case 'VehicleLoan':
                    // set the form type to true to reveal with react transition group
                    setShowAmortizedLoanForm(true);

                    setFormState({
                         LoanCategory: "VehicleLoan"
                    })
               break;

               case 'PersonalLoan':
                    // set the form type to true to reveal with react transition group
                    setShowAmortizedLoanForm(true);

                    setFormState({
                         LoanCategory: "PersonalLoan"
                    })
               break;

               case 'CreditCard':
                    // set the form type to true to reveal with react transition group
                    setShowAmortizedLoanForm(false);

                    setFormState({
                         LoanCategory: "CreditCard"
                    })
               break;

               default:
                    // set the form type to true to reveal with react transition group
                    setShowAmortizedLoanForm(false);

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


     // function to calculate the total loan amount
     const calculateTotalLoanAmount = () => {
          // if either of the current values are NaN, return filler text
          if (isNaN(parseFloat(formState.MonthlyPayment)) || isNaN(parseFloat(formState.TotalTermLength))) {
               return "---"
          
          // perfom calculations with bignumber as these may be floating point
          } else {
               let monthlyPayment = new BigNumber(formState.MonthlyPayment);
               let totalTermLength = new BigNumber(formState.TotalTermLength);

               let totalLoanAmount = monthlyPayment.multipliedBy(totalTermLength).toFixed(2)

               return moneyFormatter(totalLoanAmount);
          }
     }

     // function to calculate remaining periods
     const calculateRemainingPeriods = () => {

          // ensure fields are filled 
          if (isNaN(formState.MonthlyPayment) || isNaN(formState.PresentValue) || isNaN(formState.InterestRate)) {

               return "---"
          
          } else {
               // https://financeformulas.net/Loan_Payment_Formula.html
               let monthlyPayment = new BigNumber(formState.MonthlyPayment);
               let presentValue = new BigNumber(formState.PresentValue);
               let interestRate = new BigNumber(formState.InterestRate);

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

               return Math.ceil(finalResult.toNumber());
          }
     }


     // Overlay triggers listed as consts to keep return statement easier to read
     const colorOverlay = (
          <OverlayTrigger
          placement="top"
          overlay={
               <Popover id="popover-basic" className="customPopover">
                    <Popover.Header as="h3" className="customPopoverHeader">Loan Color</Popover.Header>
                    <Popover.Body className="customPopoverBody">
                         <span>Click the box below to select a color for color-coded lists and graphs. This can be whatever you'd like.</span>
                    </Popover.Body>
               </Popover>
          }>
               <div className="addALoanHelpOverlay">
                    <FaInfoCircle/>
               </div>
          </OverlayTrigger>
     );

     const dispersmentDateOverlay = (
          <OverlayTrigger
          placement="top"
          overlay={
               <Popover id="popover-basic" className="customPopover">
                    <Popover.Header as="h3" className="customPopoverHeader">Disbursement Date</Popover.Header>
                    <Popover.Body className="customPopoverBody">
                         <span>The day the loan was given to you.</span>
                    </Popover.Body>
               </Popover>
          }>
               <div className="addALoanHelpOverlay">
                    <FaInfoCircle/>
               </div>
          </OverlayTrigger>
     );

     const paymentDateOverlay = (
          <OverlayTrigger
          placement="top"
          overlay={
               <Popover id="popover-basic" className="customPopover">
                    <Popover.Header as="h3" className="customPopoverHeader">Payment Due Date</Popover.Header>
                    <Popover.Body className="customPopoverBody">
                         <span>This is the day that you must pay your monthly payment. If you pay on the 18th of each month, enter the number 18.</span>
                    </Popover.Body>
               </Popover>
          }>
               <div className="addALoanHelpOverlay">
                    <FaInfoCircle/>
               </div>
          </OverlayTrigger>
     );

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


     return(
          <div className="componentContainer">
               <h1 className="componentTitle">Add a New Loan</h1>

               <div className="dashboardModulesContainer AddALoanForm">

                    {/* alert */}
                    <Alert variant="danger" show={!submittable}>
                         <Alert.Heading>
                              Error
                         </Alert.Heading>
                         {errorState.text}
                    </Alert>

                    <div className="dashboardModule typeOfLoan">
                         {/* https://www.investopedia.com/terms/a/amortized_loan.asp */}

                         <div className="moduleHeader">
                              <h2>Type of Loan</h2>
                         </div>

                         <div className="moduleContent typeOfLoanContent">
                              {loanTypeRadios.map((radio, idx) => (
                                   <ButtonGroup key={idx} className="mb-2 loanTypeButtonGroup">  
                                        <ToggleButton
                                        id={`radio-${idx}`}
                                        type="radio"
                                        variant="outline-success"
                                        name="radio"
                                        className="loanTypeButton"
                                        value={radio.value}
                                        checked={formState.LoanCategory === radio.value}
                                        onChange={e => loanTypeSelection(e.target.value)}>

                                             <div className="loanTypeIMG">{radio.img}</div>
                                             <h5>{radio.name}</h5>
                                        </ToggleButton>
                                   </ButtonGroup>
                              ))}
                         </div>
                    </div>


                    
                    {/* Amortized Loans */}
                    <CSSTransition
                    in={showAmortizedLoanForm}
                    timeout={500}
                    unmountOnExit
                    classNames="amortizedLoanForm">
                    
                         <div className="addALoanRequiredInfo dashboardModule">
                              <div className="moduleHeader">
                                   <h2>Required Loan Information</h2>
                              </div>
                         
                              {/* First Row */}
                              <div className="formGroupRow">
                                   {/* Loan Name */}
                                   <Form.Group controlId="LoanName" className="loanNameDiv">
                                        <Form.Label className="addALoanFormLabel">Loan Name</Form.Label>
                                        
                                        <Form.Control type="Text" name="LoanName" placeholder="Enter a name for this loan" className={`addALoanInput ${errorState.field == "LoanName" ? "errorField": ""}`} 
                                        onChange={e => handleChange(e.target.value, e.target.name)}/>
                                        <Form.Text className="text-muted">You can name it whatever you'd like. This is just for you to keep track of it</Form.Text>
                                   </Form.Group>

                                   {/* Color */}
                                   <Form.Group controlId="ColorPicker" className="colorPickerDiv">
                                        <div className="addALoanFormLabel">
                                             <Form.Label>Loan Color</Form.Label>
                                             {colorOverlay}
                                        </div>

                                        <Form.Control
                                        name="LoanColor"
                                        type="color"
                                        defaultValue={colorGenerator()}
                                        title="Choose your color"
                                        onChange={e => handleChange(e.target.value, e.target.name)}
                                        />
                                   </Form.Group>
                              </div>


                              {/* Second Row */}
                              <div className="formGroupRow">
                                   {/* Interest Rate */}
                                   <Form.Group controlId="InterestRate" className="interestRateDiv">
                                        <div className="addALoanFormLabel">
                                             <Form.Label>Interest Rate</Form.Label>
                                        </div>

                                        <CurrencyInput
                                             suffix="%"
                                             name="InterestRate"
                                             placeholder="3%"
                                             decimalScale={2}
                                             decimalsLimit={2}
                                             allowNegativeValue={false}
                                             onValueChange={(value, name) => handleChange(value, name)}
                                             className={`addALoanInput ${errorState.field == "InterestRate" ? "errorField": ""}`}
                                        />
                                   </Form.Group>

                                   {/* Disbursement Date */}
                                   <Form.Group controlId="DisbursementDate" className="disbursementDateDiv">
                                        <div className="addALoanFormLabel">
                                             <Form.Label>Disbursement Date</Form.Label>
                                             {dispersmentDateOverlay}
                                        </div>

                                        <Form.Control type="date" name="DisbursementDate" className={`addALoanInput ${errorState.field == "DisbursementDate" ? "errorField": ""}`}
                                        onChange={e => handleChange(e.target.value, e.target.name)} />
                                   </Form.Group>
                              </div>


                              {/* Third Row */}
                              <div className="formGroupRow">
                                   {/* Payment Date */}
                                   <Form.Group controlId="PaymentDate" className="paymentDateDiv">
                                        <div className="addALoanFormLabel">
                                             <Form.Label>Payment Due Date</Form.Label>
                                             {paymentDateOverlay}
                                        </div>

                                        <Form.Control
                                        type="text"
                                        value={paymentDateState}
                                        onChange={e => paymentDateVerifier(e.target.value)}
                                        className={`addALoanInput ${errorState.field == "PaymentDate" ? "errorField": ""}`}>
                                        </Form.Control>
                                   </Form.Group>

                                   <div className="nextDateGeneratorDiv">
                                        {nextDateGenerator()}
                                   </div> 
                              </div>
                         </div>

                    </CSSTransition>

                    
                    <CSSTransition
                    in={showAmortizedLoanForm}
                    timeout={500}
                    unmountOnExit
                    classNames="amortizedLoanForm">
                    
                         <div className="addALoanRepaymentInfo dashboardModule">
                              <div className="moduleHeader">
                                   <h2>Repayment Options</h2>
                              </div>

                              {/* Payback Choice Radio buttons */}
                              <div className="formGroupRow paybackChoiceDiv">
                                   <div className="paybackChoiceHeader">
                                        <h6>You must select one of the options below. This option is not related to the loan itself, but how you prefer to capture the data.</h6>
                                   </div>

                                   <div className="paybackRadioDiv">
                                        <Form.Check
                                        type="radio"
                                        id="paybackChoice-1">

                                             <Form.Check.Input
                                             name="PaybackRadio"
                                             type="radio"
                                             id="paybackChoice-1"
                                             value="paybackFromTotal"
                                             defaultChecked
                                             onChange={e => handleRadioChange(e.target.value)}
                                             />

                                             <Form.Check.Label className="paybackChoiceLabel">
                                                  <h5>Payback from Total</h5>
                                                  <span className="paybackChoiceDesc text-muted">This option will calculate the total amount you will pay for this loan. This can be beneficial for internally calculated interest payments and more accurate payback graphs and data, but will require you to enter all previous payments to be up-to-date.</span>
                                             </Form.Check.Label>
                                        </Form.Check>
                                   </div>

                                   <div className="paybackRadioDiv">
                                        <Form.Check
                                        type="radio"
                                        id="paybackChoice-2">

                                             <Form.Check.Input
                                             name="PaybackRadio"
                                             type="radio"
                                             id="paybackChoice-2"
                                             value="paybackFromCurrent"
                                             onChange={e => handleRadioChange(e.target.value)}/>

                                             <Form.Check.Label className="paybackChoiceLabel">
                                                  <h5>Payback from Current Amount</h5>
                                                  <span className="paybackChoiceDesc text-muted">This option will let you avoid entering many old payments, which is beneficial if you have an older loan. this option may have a miniscule effect on interest amounts, as some loan holders may or may not include interest when viewing the current loan amount. You will also need to know exactly how many payments are remaining in you loan plan.</span>
                                             </Form.Check.Label>
                                        </Form.Check>
                                   </div>
                              </div>                                   
                              

                              {/* third Row For Payback from Total */}
                              <div className={`formGroupRow paybackVariablesGroup ${radioState === "paybackFromTotal" ? "" : "hideThisFormBlock"}`}>
                                   <div className="repaymentOptions">
                                   
                                        {/* Monthly Payment */}
                                        <Form.Group controlId="MonthlyPayment" className="monthlyPaymentDiv">
                                             <Form.Label>Minimum Monthly Payment Amount</Form.Label>
                                             <CurrencyInput
                                                  prefix="$"
                                                  name="MonthlyPayment"
                                                  placeholder="$100"
                                                  decimalScale={2}
                                                  decimalsLimit={2}
                                                  allowNegativeValue={false}
                                                  onValueChange={(value, name) => handleChange(value, name)}
                                                  className={`addALoanInput ${errorState.field == "MonthlyPayment" ? "errorField": ""}`}
                                             />
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
                                                  placeholder="60"
                                                  allowDecimals={false}
                                                  allowNegativeValue={false}
                                                  onValueChange={(value, name) => handleChange(value, name)}
                                                  className={`addALoanInput ${errorState.field == "TotalTermLength" ? "errorField": ""}`}
                                             />
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

                                        <h3>{calculateTotalLoanAmount()}</h3>
                                   </div>
                              </div>


                              {/* third Row For Payback from Current */}
                              <div className={`formGroupRow paybackVariablesGroup ${radioState === "paybackFromCurrent" ? "" : "hideThisFormBlock"}`}>
                                   <div className="repaymentOptions">
                                   
                                        {/* Monthly Payment */}
                                        <Form.Group controlId="MonthlyPayment" className="monthlyPaymentDiv">
                                             <Form.Label>Minimum Monthly Payment Amount</Form.Label>
                                             <CurrencyInput
                                                  prefix="$"
                                                  name="MonthlyPayment"
                                                  placeholder="$100"
                                                  decimalScale={2}
                                                  decimalsLimit={2}
                                                  allowNegativeValue={false}
                                                  onValueChange={(value, name) => handleChange(value, name)}
                                                  className={`addALoanInput ${errorState.field == "MonthlyPayment" ? "errorField": ""}`}
                                             />
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
                                                  placeholder="$10,000"
                                                  allowNegativeValue={false}
                                                  onValueChange={(value, name) => handleChange(value, name)}
                                                  className={`addALoanInput ${errorState.field == "PresentValue" ? "errorField": ""}`}
                                             />
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
                         </div>

                    </CSSTransition>

                    <CSSTransition
                    in={showAmortizedLoanForm}
                    timeout={500}
                    unmountOnExit
                    classNames="amortizedLoanForm">
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
                                        <Form.Control type="Text" name="LoanLink" placeholder="enter the link for the loan's site" 
                                        onChange={e => handleChange(e.target.value, e.target.name)}
                                        className="addALoanInput"/>
                                        <Form.Text className="text-muted">This is for quick access to make payments</Form.Text>
                                   </Form.Group>
                              </div>


                              {/* Second Row */}
                              <div className="formGroupRow additionalNotesRow">
                                   <Form.Group controlId="AdditionalNotes" className="additionalNotesDiv">
                                        <Form.Label>Additional Notes</Form.Label>
                                        <Form.Control as="textarea" rows={3} name="AdditionalNotes" placeholder="This Loan is for..." 
                                        onChange={e => handleChange(e.target.value, e.target.name)}
                                        className="addALoanInput addALoanTextArea"/>
                                        <Form.Text className="text-muted">Any other notes you want attached to this loan</Form.Text>
                                   </Form.Group>
                              </div>

                         </div>
                    </CSSTransition>

                    
                    <CSSTransition
                    in={showAmortizedLoanForm}
                    timeout={500}
                    unmountOnExit
                    classNames="amortizedLoanForm">
                         <div className="addALoanSubmitCancel dashboardModule">
                              <Button variant="outline-danger" size="lg" type="cancel" onClick={() => cancel()}>
                                   Cancel
                              </Button>

                              <Button variant="success" size="lg" onClick={() => dataValidator()}>
                                   Submit
                              </Button>
                         </div>
                    </CSSTransition>

                    

                    
               </div>

          </div>
     )
}