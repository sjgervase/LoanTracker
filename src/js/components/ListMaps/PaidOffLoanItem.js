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



export default function PaidOffLoanItem(props) {

     let loan = props.loan;

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     // navigate functionality
     let navigate = useNavigate();

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


     // tell main process to open the link in the default browser
     function openLinkInBrowser(url) {
          if (url == "") {
               // do nothing
          } else {
               ipcRenderer.invoke('openLinkToPaymentURL', (url));
          }
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

     // if paid off

     return(               
          <div 
          style={borderStyle(loan.LoanColor)}
          className="loanItem">

               <div className="loanItemTable">

                    <div className="loanCategoryIcon">
                         {loanTypeIcon(loan.LoanCategory)}
                    </div>

                    <div className="loanItemMainRow">

                         {/* leave for spacing */}
                         <div className="loanItemTopRow"></div>

                         <div className="loanItemBottomRow">

                              <div className="loanTitle">
                                   <h3>{loan.LoanName}</h3>
                              </div>

                              <div className="paymentsAndButtons">
                                   
                                   <h3 className="paymentAndDate">was: {moneyFormatter(loan.TotalLoanAmount)}</h3>
                                   
                                   {/* make button only exist if link was entered */}
                                   <Button variant="success" className="btn-sm btn-custom py0" onClick={() => openLinkInBrowser(loan.LoanLink)}>Link to Loan</Button>
                                   <Button variant="secondary" className="btn-sm btn-custom py0 moreInfoButton" onClick={() => loanItemView(loan.GUID)}>More Info</Button>
                                   
                              </div>

                         </div>
                    </div>

               </div>
          </div>
     );
}