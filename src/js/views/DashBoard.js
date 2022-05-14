import React from "react";

// import components
import LoanList from "../components/LoanList";
import LoansPieChart from "../components/LoansPieChart";
import RecentlyRecordedPayments from "../components/RecentRecordedPayments";


export default function DashBoard(props) {

     // console.log(props.data?.data);

     // create loans variable to reduce make object easier to work with
     // let loans = props.data?.data;

     // console.log(loans);



     return(               
          <div className="componentContainer">
               <h1 className="componentTitle">DashBoard</h1>

               <div className="dashboardModules">
               
                    <div className="activeLoans dashboardModule">

                         <div className="moduleHeader"><span>ACTIVE LOANS</span></div>
                         
                         <div className="loanListContainer">
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

                         <div className="moduleHeader"><span>Recent Payments</span></div>
                         <RecentlyRecordedPayments data={props.data?.data}/>
                    </div>

                    
               </div>
          </div>
     );
}