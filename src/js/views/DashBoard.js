import React from "react";

import { useNavigate } from "react-router-dom";

import { Button } from "react-bootstrap";

// import components
import LoanList from "../components/ListMaps/ActiveLoanList";
import LoansPieChart from "../components/Charts/LoansPieChart";
import RecentlyRecordedPayments from "../components/ListMaps/RecentRecordedPayments";


export default function DashBoard(props) {

     // navigate functionality
     let navigate = useNavigate();

     // functionality for if an end user has no loans. 
     function addALoan() {
          navigate('/addaloan');
     }

     function noData() {
          // if there is no data

          if (props.loans?.length == 0 || props.loans?.length == undefined) {

               return(
                    <div className="noLoansDiv">
                         <p>It looks like you don't have any loans yet. Click the button below to add your first one. Or, you can click on "Loans" in the top navigation bar and add a loan from there.</p>

                         <Button size="lg" variant="success" onClick={()=>addALoan()}>
                              Add Your First Loan
                         </Button>
                    </div>
               );
          }
     }


     return(               
          <div className="componentContainer">
               <h1 className="componentTitle">DashBoard</h1>

               <div className="dashboardModules">
               
                    <div className="activeLoans dashboardModule">
                         <div className="moduleHeader"><span>ACTIVE LOANS</span></div>
                         
                         <div className="loanListContainer">
                              {/* if the end user has no loans */}
                              {noData()}

                              <LoanList loans={props.loans} parent={"DashBoard"}/>
                         </div>
                         
                    </div>



                    {/* https://www.npmjs.com/package/recharts */}
                    {/* https://blog.logrocket.com/top-5-react-chart-libraries/ */}



                    <div className="activeLoansGraphs dashboardModule">
                         <div className="moduleHeader"><span>TOTAL LOANS</span></div>
                         
                         <LoansPieChart loans={props.loans}/>
                         
                    </div>



                    <div className="recentTrackedPayments dashboardModule">

                         <div className="moduleHeader"><span>RECENTLY RECORDED PAYMENTS</span></div>
                         <RecentlyRecordedPayments loans={props.loans}/>
                    </div>

                    
               </div>
          </div>
     );
}