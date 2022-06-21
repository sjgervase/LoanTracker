import React from "react";

// import from react-redux
import { useSelector } from "react-redux";

// import from react router dom
import { useNavigate } from "react-router-dom";

// import from electron
import { ipcRenderer } from "electron";

// import from react bootstrap
import { Button } from "react-bootstrap";

// import from bignumber
import { BigNumber } from "bignumber.js";

// icons from react-icons
import { AiFillCar, AiFillHome } from "react-icons/ai"; 
import { FaGraduationCap, FaUser, FaCreditCard } from "react-icons/fa";

// import components
import RecordAPaymentModal from "../Modals/RecordAPaymentModal";
import DeleteLoanModal from "../Modals/DeleteLoanModal";


export default function ActiveLoanList(props) {

     // get data from redux store
     // only loans are needed
     const loansState = useSelector((state) => state.loans);


     // function to generate an array of loans that have not been designated as "paid off" and sorted by interest rate
     function activeLoansFunction() {
          // create an empty array
          let activeLoans = [];

          // default data is an empty array
          if (loansState.loans.length > 0) {
               // for each loan
               for (let i = 0; i < loansState.loans.length; i++) {
                    // if the loan has not been marked as paid off
                    if (!(loansState.loans[i].loan.PaidOff)) {
                         // push to array
                         activeLoans.push(loansState.loans[i].loan);
                    }
               }
          }

          // sort by interestRate
          activeLoans.sort((first, second) => {
               return first.InterestRate < second.InterestRate ? -1 : 1;
          });

          return activeLoans;
     }
     // generate array of active loans
     const activeLoans = activeLoansFunction();


     // All functions for the individual item 

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     // returns the icon relating to whichever loan category was selected
     function loanTypeIcon(loanCategory) {
          switch (loanCategory) {
               case 'Student Loan':
               return(<FaGraduationCap/>);     
               
               case 'Mortgage':
               return(<AiFillHome/>);     

               case 'Vehicle Loan':
               return(<AiFillCar/>);

               case 'Personal Loan':
               return(<FaUser/>);

               case 'Credit Card':
               return(<FaCreditCard/>);
          }
     }

     // calculate date until payment
     function dateCalculator(paymentDate) {
          // get the todays date number 
          let today = new Date();
          let dd = String(today.getDate()).padStart(2, '0'); // gets the day

          // subtract date values
          let dateDiff = parseInt(paymentDate) - parseInt(dd);

          // if greater than 0, the loan is due this month
          if (dateDiff > 0) {
               return dateDiff
          
          // the loan is due next month
          } else {
               // get next month
               var nextMonthDate = new Date(today.setMonth(today.getMonth()+1));

               // get the payment date of next month
               nextMonthDate.setDate(paymentDate);

               // ensure it doesnt break in december as january might be 0
               let timeDifferenceMS = new BigNumber(nextMonthDate - new Date());

               let timeDiffDays = timeDifferenceMS.dividedBy((1000*60*60*24));

               timeDiffDays = Math.ceil(timeDiffDays);
               
               // console.log(timeDiffDays);
               return timeDiffDays.toString();
          }
     }

     // tell main process to open the link in the default browser
     function openLinkInBrowser(url) {
          if (url == "") {
               // do nothing
          } else {
               ipcRenderer.invoke('openLinkToPaymentURL', (url));
          }
     }

     // function to return the selected user color
     function borderStyle(color) {
          if (color !="") {
               return {
                    border: "1px solid" + color,
                    borderRight: "5px solid" + color
               }
          }
     }

     // navigate functionality
     let navigate = useNavigate();

     // functionality for more info button
     // pass the guid of the selected loan
     function loanItemView(GUID) {
          // console.log(seeThisLoan);
          navigate('/loanitemview', {state:GUID});
          
     }

     // function to show the "delete" button on the loan item only if the end user is in the "All Loans" view
     function showDeleteButton(loan) {
          if (props.parent == "AllLoans") {
               return(
                    <DeleteLoanModal loan={loan}/>
               )
          }
     }

     return(
          <div className="listContainer">
               <div className="list">
                    {activeLoans.map(loan =>
                    
                         <div 
                         key={loan.GUID}
                         style={borderStyle(loan.LoanColor)}
                         className="loanItem">

                              <div className="loanItemTable">
                                   <div className="loanCategoryIcon">
                                        {loanTypeIcon(loan.LoanCategory)}
                                   </div>

                                   <div className="loanItemMainRow">
                                        <div className="loanItemTopRow">
                                             <span className="interestRateSpan">{loan.InterestRate}% Interest Rate</span>
                                        </div>

                                        <div className="loanItemBottomRow">
                                             <div className="loanTitle">
                                                  <h3>{loan.LoanName}</h3>
                                             </div>

                                             <div className="paymentsAndButtons">
                                                  <h3 className="paymentAndDate">{moneyFormatter(loan.MonthlyPayment) + " due in " + dateCalculator(loan.PaymentDate) + " days"}</h3>
                                                  {showDeleteButton(loan)}

                                                  {/* make button only exist if link was entered */}
                                                  <Button variant="success" className="btn-sm btn-custom py0" onClick={() => openLinkInBrowser(loan.LoanLink)}>Link to Loan</Button>
                                                  <Button variant="secondary" className="btn-sm btn-custom py0 moreInfoButton" onClick={() => loanItemView(loan.GUID)}>More Info</Button>
                                                  
                                                  <RecordAPaymentModal loan={loan} parent={"ActiveLoanItem"}/>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
}