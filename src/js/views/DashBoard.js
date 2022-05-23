import React from "react";

import { useNavigate } from "react-router-dom";

import { Button } from "react-bootstrap";

// import components
import LoanList from "../components/LoanList";
import LoansPieChart from "../components/Charts/LoansPieChart";
import RecentlyRecordedPayments from "../components/RecentRecordedPayments";


export default function DashBoard(props) {

     console.log(props.data);


     // navigate functionality
     let navigate = useNavigate();

     // functionality for if an end user has no loans. 
     function addALoan() {
          navigate('/addaloan');
     }

     function noData() {
          // if there is no data
          if (props.data?.length == undefined) {
               console.log("hi");

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

                              <LoanList loans={props.data?.data}/>
                         </div>
                         
                    </div>



                    {/* https://www.npmjs.com/package/recharts */}
                    {/* https://blog.logrocket.com/top-5-react-chart-libraries/ */}



                    <div className="activeLoansGraphs dashboardModule">
                         <div className="moduleHeader"><span>TOTAL LOANS</span></div>
                         
                         <LoansPieChart data={props.data?.data}/>
                         
                    </div>



                    <div className="recentTrackedPayments dashboardModule">

                         <div className="moduleHeader"><span>RECENTLY RECORDED PAYMENTS</span></div>
                         <RecentlyRecordedPayments data={props.data?.data}/>
                    </div>

                    
               </div>
          </div>
     );
}