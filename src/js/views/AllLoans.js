import React from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

import { Table } from "react-bootstrap";

import { BigNumber } from "bignumber.js"

// import components
import ActiveLoanList from "../components/ListMaps/ActiveLoanList";
import PaidOffLoanList from "../components/ListMaps/PaidOffLoanList";

export default function AllLoans() {

     // get data from redux store
     const loansState = useSelector((state) => state.loans);
     // get all settings from redux store for dynamic dark mode of the table
     const settingsState = useSelector((state) => state.settings);

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     // function for total loan amount
     function totalLoanAmount() {
          // create big number equal to 0 to keep track of running total
          let runningTotal = new BigNumber(0);
          
          // for each loan
          for (let i = 0; i < loansState.loans.length; i++) {

               // if the loan has not been paid off
               if (!(loansState.loans[i].loan.PaidOff)) {
                    // get the Calculated Remaining Amount of that loan
                    let currentAmount = new BigNumber(loansState.loans[i].loan.CalculatedRemainingAmount);
                    // add the amount to running total
                    runningTotal = runningTotal.plus(currentAmount);
               }
          }
          return runningTotal.toFixed(2)
     }

     return(
          <div className="componentContainer">
               <h1 className="componentTitle">All Loans</h1>

               <div className="dashboardModulesContainer">

                    <div className="totalLoanAmount dashboardModule">
                         <div className="moduleHeader">
                              <h2>Total Loans Amount</h2>
                         </div>

                         <div className="moduleContent allLoansModuleContent">
                              <div className="tableContainer">
                                   <Table striped bordered hover size="sm" className="allLoansTable" variant={settingsState.settings[0]?.UserSelectedTheme == "dark" ? "dark" : "light"}>
                                        <thead className="allLoansTableHead">
                                             <tr>
                                                  <th>Loan Name</th>
                                                  <th>Interest Rate</th>
                                                  <th>Loan Amount</th>
                                             </tr>
                                        </thead>
                                        

                                        <tbody className="allLoansTableBody">
                                             {loansState.loans.map(loan =>
                                                  <tr key={loan.loan.GUID}>
                                                       <td>{loan.loan.LoanName}</td>
                                                       <td>{loan.loan.InterestRate}%</td>
                                                       <td>{moneyFormatter(loan.loan.CalculatedRemainingAmount)}</td>
                                                  </tr>
                                             )}
                                        </tbody>
                                        
                                   </Table>
                              </div>
                              
                              <div className="allLoansGrandTotal">
                                   <h5>Grand Total of all Active Loans</h5>
                                   <h1>{moneyFormatter(totalLoanAmount())}</h1>
                              </div>
                         </div>
                    </div>

                    <div className="activeLoansAllLoans dashboardModule">
                         <div className="moduleHeader">
                              <h2>Active Loans</h2>
                         </div>

                         <div className="moduleContent">
                              <ActiveLoanList parent={"AllLoans"}/>
                         </div>
                    </div>

                    <div className="paidOffLoansAllLoans dashboardModule">
                         <div className="moduleHeader"><h2>Paid Off Loans</h2></div>

                         <div className="loanListContainer">
                              <PaidOffLoanList />
                         </div>
                    </div>

               </div>
          </div>
     )
}