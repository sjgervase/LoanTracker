import React, { useState } from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import from electron
import { ipcRenderer } from "electron";

// import from react-router-dom
import { useLocation } from "react-router-dom";


// import from react-bootstrap
import { Button, Popover, OverlayTrigger, Accordion } from "react-bootstrap";

// icons from react-icons
import { AiFillCar, AiFillHome } from "react-icons/ai"; 
import { FaGraduationCap, FaUser, FaCreditCard, FaInfoCircle } from "react-icons/fa";

// import Components
import RecordAPaymentModal from "../components/Modals/RecordAPaymentModal";
import LoansLineChart from "../components/Charts/LoansLineChart";
import RecordALateFeeModal from "../components/Modals/RecordALateFeeModal";
import AdjustMonthlyPaymentModal from "../components/Modals/AdjustMonthlyPaymentModal";
import RecentlyRecordedPayments from "../components/ListMaps/RecentRecordedPayments";




export default function LoanItemView() {
     
     // gets the params passed to this page from the "More Info" button
     // only param is GUID
     const {state} = useLocation();

     // get all settings from redux store for dynamic dark mode
     const settingsState = useSelector((state) => state.settings);

     // get data from redux store
     // only loans are needed
     const loansState = useSelector((state) => state.loans);

     // the current loan that has been clicked on
     const currentLoan = loansState.loans.find(obj => obj.loan.GUID === state);

     // returns the icon relating to whichever loan category was selected
     function loanTypeIcon(loanCategory) {
          switch (loanCategory) {
               case 'Student Loan':
               return(<FaGraduationCap/>);     
               
               case 'Mortgage':
               return(<AiFillHome/>);     

               case 'Auto Loan':
               return(<AiFillCar/>);

               case 'Personal Loan':
               return(<FaUser/>);

               case 'Credit Card':
               return(<FaCreditCard/>);
          }
     }

     // returns loan type and info for help icon
     function loanTypeInfo(loanCategory) {
          // string variables for each loan type
          var amortizingLoanInfo = "An amortized loan is a type of loan with scheduled, periodic payments that are applied to both the loan's principal amount and the interest accrued. An amortized loan payment first pays off the relevant interest expense for the period, after which the remainder of the payment is put toward reducing the principal amount. Common amortized loans include auto loans, home loans, and personal loans from a bank for small projects or debt consolidation.";
          var revolvingLoanInfo = "A revolving loan facility is a form of credit issued by a financial institution that provides the borrower with the ability to draw down or withdraw, repay, and withdraw again. A revolving loan is considered a flexible financing tool due to its repayment and re-borrowing accommodations. It is not considered a term loan because, during an allotted period of time, the facility allows the borrower to repay the loan or take it out again.A revolving loan facility is a form of credit issued by a financial institution that provides the borrower with the ability to draw down or withdraw, repay, and withdraw again. A revolving loan is considered a flexible financing tool due to its repayment and re-borrowing accommodations. It is not considered a term loan because, during an allotted period of time, the facility allows the borrower to repay the loan or take it out again.";

          // empty object to be populated by switch
          let useThisLoanInfo = {};

          switch (loanCategory) {
               case 'Student Loan':
                    // populate object based on type
                    useThisLoanInfo.type = 'AMORTIZED LOAN';
                    useThisLoanInfo.Info = amortizingLoanInfo;
               break;
               
               case 'Mortgage':
                    // populate object based on type
                    useThisLoanInfo.type = 'AMORTIZED LOAN';
                    useThisLoanInfo.Info = amortizingLoanInfo;
               break;

               case 'Auto Loan':
                    // populate object based on type
                    useThisLoanInfo.type = 'AMORTIZED LOAN';
                    useThisLoanInfo.Info = amortizingLoanInfo;
               break;
               

               case 'Personal Loan':
                    // populate object based on type
                    useThisLoanInfo.type = 'AMORTIZED LOAN';
                    useThisLoanInfo.Info = amortizingLoanInfo;
               break;

               case 'Credit Card':
                    // populate object based on type
                    useThisLoanInfo.type = 'REVOLVING LOAN';
                    useThisLoanInfo.Info = revolvingLoanInfo;
               break;
          }

          const popover = (
               <Popover id="popover-basic" className="customPopover">
                    <Popover.Header as="h3" className="customPopoverHeader">{useThisLoanInfo.type}</Popover.Header>
                    
                    <Popover.Body className="customPopoverBody">
                         {useThisLoanInfo.Info}
                    </Popover.Body>
               </Popover>
          );

          // return that is populated by above object
          // easy tooltip from: https://codepen.io/cristina-silva/pen/XXOpga
          return(
               <>
                    <span className="text-muted">{useThisLoanInfo.type}</span>
                    
                    <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={popover}>
                         <Button 
                         variant={settingsState.settings[0]?.UserSelectedTheme == "dark" ? "dark" : "light"}
                         className="btn-sm btn-overlay">
                              <FaInfoCircle className="loanInfoTypeHelp"/>
                         </Button>
                    </OverlayTrigger>
               </>
          );
     }

     // calculate date until payment
     function dateCalculator(paymentDate) {

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

          // switch for ordinal after number, ie 1st, 2nd, 3rd, 4th
          // note, paymentDate is recieved as a string
          let d = parseInt(paymentDate);

          let ordinal;
          if (d > 3 && d < 21) {
               ordinal = "th";
          } else {
               switch (d % 10) {
                    case 1: ordinal = "st"; break;
                    case 2: ordinal = "nd"; break;
                    case 3: ordinal = "rd"; break;
                    default: ordinal = "th"; break;
               }
          }

          // calculate the difference in days
          let dateDiff = parseInt(paymentDate) - parseInt(dd);

          if (dateDiff > 0) {
               // its due this month, easy calculation
               // ex due in 6 days

               // set the date value to the day of payment
               today.setDate(d);
               
               // set return objects
               returnObjStrings.monthName = monthNames[today.getMonth()];
               returnObjStrings.dayName = days[today.getDay()];
               returnObjStrings.daysTilPayment = dateDiff;
          
          } else {
               // due next month
               // get next month from todays 
               var nextMonthDate = new Date(today.setMonth(today.getMonth()+1));

               // get the payment date of next month
               nextMonthDate.setDate(paymentDate);

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
               <span>
                    {returnObjStrings.daysTilPayment} days on {returnObjStrings.dayName}, {returnObjStrings.monthName} {paymentDate}{ordinal}
               </span>
          );


     }
     
     // tell main process to open the link in the default browser
     function openLinkInBrowser(url) {
          if (url == "") {
               // do nothing
          } else {
               ipcRenderer.invoke('openLinkToPaymentURL', (url));
          }
     }

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     

     return(
          <div className="componentContainer">

               <h1 className="componentTitle">{currentLoan?.loan.LoanName}</h1>
               <div className="loanItemType">
                    <h3>{loanTypeIcon(currentLoan?.loan.LoanCategory)} {currentLoan?.loan.LoanCategory}</h3>
                    
                    <div className="loanTypeInfoDiv">
                         {loanTypeInfo(currentLoan?.loan.LoanCategory)}
                    </div>
               </div>

               <div className="dashboardModules">
                    <div className="loanTools dashboardModule">
                         <div className="moduleHeader"><span>TOOLS</span></div>

                         <Button variant="success" className="btn-custom" size="lg" onClick={() => openLinkInBrowser(currentLoan?.loan.LoanLink)}>Link to Loan</Button>
                         <RecordAPaymentModal loan={currentLoan} parent={LoanItemView}/>
                         <RecordALateFeeModal loan={currentLoan} parent={LoanItemView}/>
                         <AdjustMonthlyPaymentModal loan={currentLoan}/>
                    </div>

                    <div className="loanQuickInfo dashboardModule">
                         <div className="moduleHeader"><span>LOAN INFO</span></div>
                         <div className="loanInfoHeader">
                              <span className="display-4">{moneyFormatter(currentLoan?.loan.CalculatedRemainingAmount)} remaining at {currentLoan?.loan.InterestRate}% interest</span>
                              
                              <h5> Next Payment of {moneyFormatter(currentLoan?.loan.MonthlyPayment)} due in {dateCalculator(currentLoan?.loan.PaymentDate)}</h5>
                         </div>
                    </div>

                    <div className="paymentsOverTime dashboardModule">
                         <div className="moduleHeader"><span>PAYMENTS OVER TIME</span></div>

                         <p className="lead paymentsOverTimeDirections">Click "Record a Payment" or "Record a Late Fee" in the Tools module above to add more data points to this graph</p>

                         <div className="paymentsOverTiemChart">
                              <LoansLineChart data={currentLoan}/>
                         </div>
                    </div>

                    <div className="recentlyRecordedPayments dashboardModule">
                         <div className="moduleHeader"><span>RECENTLY RECORDED PAYMENTS</span></div>

                         <RecentlyRecordedPayments thisLoan={currentLoan?.loan.GUID}/>
                    </div>
               </div>              
          </div>
     );
}