import React from "react";

import { BigNumber } from "bignumber.js"
import { Button, Popover, OverlayTrigger, Accordion } from "react-bootstrap";
import { FaGraduationCap, FaUser, FaCreditCard, FaInfoCircle } from "react-icons/fa";

// import components
import AddMonthlyBillModal from "../components/Modals/AddMonthlyBillModal";
import AddMonthlyPayModal from "../components/Modals/AddMonthlyPayModal";
import BudgetPieChart from "../components/Charts/BudgetPieChart";
import BudgetLists from "../components/ListMaps/BudgetLists";


export default function SimpleBudget(props) {

     // function for total monthly payment amount from loans in data
     let monthlyLoansTotal = () => {
          let runningTotal = new BigNumber(0);
          for (let i = 0; i < props.loans?.length; i++) {
               // if not marked as paid off
               if (!props.loans[i].loan.PaidOff) {
                    let currentAmount = new BigNumber(props.loans[i].loan.MonthlyPayment);
                    runningTotal = runningTotal.plus(currentAmount);
               }
          }
          return runningTotal.toFixed(2);
     }

     // function for total monthly payment amount from incomes
     let monthlyIncomesTotal = () => {
          let runningTotal = new BigNumber(0);
          for (let i = 0; i < props.incomes?.length; i++) {
               let currentAmount = new BigNumber(props.incomes[i].MonthlyPay);
               runningTotal = runningTotal.plus(currentAmount);
          }
          return runningTotal.toFixed(2);
     }

     // function for total monthly bill amount from bills
     let monthlyBillsTotal = () => {
          let runningTotal = new BigNumber(0);
          for (let i = 0; i < props.bills?.length; i++) {
               let currentAmount = new BigNumber(props.bills[i].MonthlyBill);
               runningTotal = runningTotal.plus(currentAmount);
          }
          return runningTotal.toFixed(2);
     }

     // function to calculate the remaining total 
     let remainderTotal = () => {
          let incomeTotal = new BigNumber(monthlyIncomesTotal());
          let loansTotal = new BigNumber(monthlyLoansTotal());
          let billsTotal = new BigNumber(monthlyBillsTotal());
          return incomeTotal.minus(loansTotal).minus(billsTotal).toFixed(2);
     }


     // three emtpy arrays for each category for later display
     let loansArray = [];
     let billsArray = [];
     let incomesArray = [];

     // seperate function to generate the arrays for each category to be displayed as lists
     function listGenerators() {

          // loans
          for (let i = 0; i < props.loans?.length; i++) {
               // if not marked as paid off
               if (!props.loans[i].loan.PaidOff) {
                    loansArray.push({
                         "name": props.loans[i].loan.LoanName,
                         "value": parseFloat(props.loans[i].loan.MonthlyPayment)
                    })
               }
          }

          // bills
          for (let i = 0; i < props.bills?.length; i++) {
               billsArray.push({
                    "name": props.bills[i].BillName,
                    "value": parseFloat(props.bills[i].MonthlyBill)
               })
          }

          // incomes
          for (let i = 0; i < props.incomes?.length; i++) {
               incomesArray.push({
                    "name": props.incomes[i].IncomeName,
                    "value": parseFloat(props.incomes[i].MonthlyPay)
               })
          }

     }

     listGenerators();


     const popover = (
          <Popover id="popover-basic">
               

               <Popover.Body>
                    The pie chart below is a representation of your loans and bills compared to your incomes. The less green you in chart, the less disposable income you have after paying all of your monthly bills and loans
               </Popover.Body>
          </Popover>
     );


     return(
          <div className="componentContainer">
               <h1 className="componentTitle">Simple Budgeting Tool</h1>
               <p>Use this simply budgeting tool to help prepare your finances on a month by month basis</p>
               
               <AddMonthlyBillModal/>

               <AddMonthlyPayModal/>

               <div>
                    <h2>
                         Income, Bills, and Loans Breakdown
                         <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={popover}>

                              <Button variant="light" className="btn-sm btn-overlay">
                                   <FaInfoCircle className="loanInfoTypeHelp"/>
                              </Button>

                         </OverlayTrigger>
                    </h2>


                    <div className="budgetTotals">
                         <div className="budgetLists">
                              <h4>Monthly Incomes Total</h4>
                              <BudgetLists array={incomesArray}/>
                              <div className="verticalLine"></div>
                              <h3>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(monthlyIncomesTotal())}</h3>
                         </div>

                         <div className="minus">
                              -
                         </div>

                         <div className="budgetLists">
                              <h4>Monthly Loans Total</h4>
                              <BudgetLists array={loansArray}/>
                              <div className="verticalLine"></div>
                              <h3>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(monthlyLoansTotal())}</h3>
                         </div>

                         <div className="minus">
                              -
                         </div>

                         <div className="budgetLists">
                              <h4>Monthly Bills Total</h4>
                              <BudgetLists array={billsArray}/>
                              <div className="verticalLine"></div>
                              <h3>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(monthlyBillsTotal())}</h3>
                         </div>

                         <div className="minus">
                              =
                         </div>

                         <div className="budgetLists">
                              <h4>Total Remaining</h4>
                              <div className="verticalLine"></div>
                              <h3>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(remainderTotal())}</h3>
                         </div>
                    </div>

                    

                    
                    <br></br>
                    
                    <br></br>
                    
               </div>
                    


                    
                    


                    
               

               <BudgetPieChart
               loans={props.loans}
               incomes={props.incomes}
               bills={props.bills}
               />
               
               
          </div>
     )
}