import React, { useState } from "react";

// import from electron
import { ipcRenderer } from "electron";

// import from react router dom
import { useNavigate } from "react-router-dom";

// import from react bootstrap
import { Button } from "react-bootstrap";

// icons from react-icons
import { AiFillCar, AiFillHome } from "react-icons/ai"; 
import { FaGraduationCap, FaUser, FaCreditCard } from "react-icons/fa";

// import components
import RecordAPaymentModal from "./Modals/RecordAPaymentModal";



export default function LoanItem(props) {


    
     let loan = props.loan;
     // console.log(loan);


     // navigate functionality
     let navigate = useNavigate();



    


     // <h3>{"$" + new Intl.NumberFormat().format(loan.RemainingAmount)}</h3>

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


     // function termLengthCalculation() {
     //      // if either fields are empty, do not do the calc
     //      if (loan.TotalTermLength !== "" && loan.RemainingTermLength !== "") {

     //           var remainingPayments = parseInt(loan.TotalTermLength) - parseInt(loan.RemainingTermLength);


     //           return(<span>{remainingPayments} Remaining Payments</span>);
     //      }
     // }

     
     // calculate date until payment
     function dateCalculator(paymentDate) {
          // get the todays date number 
          let today = new Date();
          let dd = String(today.getDate()).padStart(2, '0'); // gets the day

          let dateDiff = parseInt(paymentDate) - parseInt(dd);

          if (dateDiff > 0) {
               // its due this month, easy calculation
               // ex due in 6 days
               // console.log("due in " + dateDiff + " days");

               return dateDiff
          } else {
               // due next month
               // get today

               // get next month
               var nextMonthDate = new Date(today.setMonth(today.getMonth()+1));

               // get the payment date of next month
               nextMonthDate.setDate(paymentDate);

               // ensure it doesnt break in december as january might be 0
               let timeDifferenceMS = nextMonthDate - new Date();

               let timeDiffDays = timeDifferenceMS/(1000*60*60*24);

               // console.log(timeDiffDays);
               return timeDiffDays
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

     // calculate amount paid
     function amountPaid(remaining, total) {
          // console.log(remaining);
          // console.log(total);
          return parseInt(total) - parseInt(remaining);
     }

     function borderStyle(color) {
          if (color !="") {
               return {
                    border: "1px solid" + loan.LoanColor,
                    borderRight: "5px solid" + loan.LoanColor
               }
          }
     }


     // functionality for more info button
     function loanItemView(seeThisLoan) {
          // console.log(seeThisLoan);
          navigate('/loanitemview', {state:seeThisLoan});
          
     }


      // fields remaining
     // "InterestRate": "4.59",
     // "LoanColor": "#007bff"


     return(               
          <div className="loanItem" style={borderStyle(loan.LoanColor)}>

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
                                   <h3 className="paymentAndDate">{"$" + new Intl.NumberFormat().format(loan.MonthlyPayment) + " due in " + dateCalculator(loan.PaymentDate) + " days"}</h3>

                                   {/* {termLengthCalculation()} */}

                                   {/* make button only exist if link was entered */}
                                   <Button variant="success" className="btn-sm btn-custom py0" onClick={() => openLinkInBrowser(loan.LoanLink)}>Link to Loan</Button>
                                   <Button variant="secondary" className="btn-sm btn-custom py0" onClick={() => loanItemView(loan)}>More Info</Button>
                                   
                                   <RecordAPaymentModal className="btn-sm" loan={loan} parent={LoanItem}/>
                              </div>

                         </div>
                    </div>

               </div>
          </div>
     );
}