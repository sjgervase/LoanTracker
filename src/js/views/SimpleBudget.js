import React from "react";
import { useNavigate } from "react-router-dom";
import { BigNumber } from "bignumber.js"
import { Button, Popover, OverlayTrigger, Accordion } from "react-bootstrap";
import { FaGraduationCap, FaUser, FaCreditCard, FaInfoCircle } from "react-icons/fa";

// import components
import AddMonthlyBillModal from "../components/Modals/AddMonthlyBillModal";
import AddMonthlyExpenseModal from "../components/Modals/AddMonthlyExpenseModal";
import AddMonthlyPayModal from "../components/Modals/AddMonthlyIncomeModal";
import AddMonthlySavingsModal from "../components/Modals/AddMonthlySavingsModal";

import BudgetPieChart from "../components/Charts/BudgetPieChart";
import BudgetLists from "../components/ListMaps/BudgetLists";


export default function SimpleBudget(props) {


     // function for total monthly loans
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


     // function for total monthly incomes
     let monthlyIncomesTotal = () => {
          let runningTotal = new BigNumber(0);
          for (let i = 0; i < props.incomes?.length; i++) {
               let currentAmount = new BigNumber(props.incomes[i].MonthlyPay);
               runningTotal = runningTotal.plus(currentAmount);
          }
          return runningTotal.toFixed(2);
     }


     // function for total monthly bills
     let monthlyBillsTotal = () => {
          let runningTotal = new BigNumber(0);
               for (let i = 0; i < props.deductions?.length; i++) {
                    // if bill
                    if (props.deductions[i].Type == "bill") {
                         let currentAmount = new BigNumber(props.deductions[i].MonthlyBill);
                         runningTotal = runningTotal.plus(currentAmount);
                    }
               }
          return runningTotal.toFixed(2);
     }


     // function for total monthly expenses
     let monthlyExpensesTotal = () => {
          let runningTotal = new BigNumber(0);
               for (let i = 0; i < props.deductions?.length; i++) {
                    // if bill
                    if (props.deductions[i].Type == "expense") {
                         let currentAmount = new BigNumber(props.deductions[i].MonthlyExpense);
                         runningTotal = runningTotal.plus(currentAmount);
                    }
               }
          return runningTotal.toFixed(2);
     }

     // function for total monthly savings
     let monthlySavingsTotal = () => {
          let runningTotal = new BigNumber(0);
               for (let i = 0; i < props.deductions?.length; i++) {
                    // if bill
                    if (props.deductions[i].Type == "savings") {
                         let currentAmount = new BigNumber(props.deductions[i].MonthlySavings);
                         runningTotal = runningTotal.plus(currentAmount);
                    }
               }
          return runningTotal.toFixed(2);
     }


     // function to calculate the remaining total 
     let remainderTotal = () => {
          let incomeTotal = new BigNumber(monthlyIncomesTotal());
          let loansTotal = new BigNumber(monthlyLoansTotal());
          let billsTotal = new BigNumber(monthlyBillsTotal());
          let expensesTotal = new BigNumber(monthlyExpensesTotal());
          return incomeTotal.minus(loansTotal).minus(billsTotal).minus(expensesTotal).toFixed(2);
     }


     // three emtpy arrays for each category for later display
     let loansArray = [];
     let billsArray = [];
     let incomesArray = [];
     let expensesArray = [];
     let savingsArray = [];

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

          // bills and expenses
          for (let i = 0; i < props.deductions?.length; i++) {

               // if bill
               if (props.deductions[i].Type == "bill") {
                    billsArray.push({
                         "name": props.deductions[i].BillName,
                         "value": parseFloat(props.deductions[i].MonthlyBill)
                    })

               // if expense
               } else if(props.deductions[i].Type == "expense") {
                    expensesArray.push({
                         "name": props.deductions[i].ExpenseName,
                         "value": parseFloat(props.deductions[i].MonthlyExpense)
                    })

               // else savings
               } else {
                    savingsArray.push({
                         "name": props.deductions[i].SavingsName,
                         "value": parseFloat(props.deductions[i].MonthlySavings)
                    })
               }

               
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

     // navigate functionality
     let navigate = useNavigate();

     // functionality for add a loan button
     function addALoanButton() {
          navigate('/addaloan');
     }

     const addALoanPopover = (
          <Popover id="popover-basic">
               <Popover.Header as="h3">Add A Loan</Popover.Header>
               <Popover.Body>
                    Add a loan, which is tracked similar to other loans added through page in the navigation bar.
                    <br></br>
                    Some Examples:
                    <br></br>
                    <ul>
                         <li>Car Loan</li>
                         <li>Student Loan</li>
                         <li>Mortgage</li>
                    </ul>
               </Popover.Body>
          </Popover>
     );


     return(
          <div className="componentContainer">
               <h1 className="componentTitle">Simple Budgeting Tool</h1>
               <p>Use this simply budgeting tool to help prepare your finances on a month by month basis</p>
               
               
               <div className="budgetTopRow">
                    <div className="budgetTools dashboardModule">
                         <div className="moduleHeader"><span>TOOLS</span></div>

                         <AddMonthlyPayModal/>

                         <AddMonthlySavingsModal/>

                         <AddMonthlyBillModal/>

                         <AddMonthlyExpenseModal/>

                         <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={addALoanPopover}>
                              <Button onClick={() => addALoanButton()} size="lg"  variant="danger" className="btn-AddALoan shadow-none">
                                   Add A loan
                              </Button>
                         </OverlayTrigger>
                    </div>

                    <div className="budgetQuickLook dashboardModule">
                         <div className="moduleHeader"><span>QUICK LOOK</span></div>

                         <div className="budgetLists">
                              <h4>Monthly Incomes Total</h4>
                              <BudgetLists array={incomesArray}/>
                              <h3>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(monthlyIncomesTotal())}</h3>
                         </div>

                         <div className="budgetTotals">

                              <div className="budgetLists">
                                   <h4>Monthly Savings Total</h4>
                                   <BudgetLists array={savingsArray}/>
                                   <h3>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(monthlySavingsTotal())}</h3>
                              </div>
                              

                              <div className="budgetLists">
                                   <h4>Monthly Loans Total</h4>
                                   <BudgetLists array={loansArray}/>
                                   <h3>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(monthlyLoansTotal())}</h3>
                              </div>

                              <div className="budgetLists">
                                   <h4>Monthly Bills Total</h4>
                                   <BudgetLists array={billsArray}/>
                                   <h3>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(monthlyBillsTotal())}</h3>
                              </div>

                              <div className="budgetLists">
                                   <h4>Monthly Expenses Total</h4>
                                   <BudgetLists array={expensesArray}/>
                                   <h3>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(monthlyExpensesTotal())}</h3>
                              </div>
                         </div>

                         <div className="budgetLists">

                              <h4>Total Remaining Income</h4>
                              <h3>
                                   {new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(remainderTotal())}
                              </h3>

                         </div>

                    </div>
               </div>


               <div className="budgetBottomRow">

                    <div className="pieChart dashboardModule">
                         
                         <div className="moduleHeader"><span>TOTALS BREAKDOWN</span></div>

                         <p>The pie chart below is a representation of your loans and bills compared to your incomes. The less green you in chart, the less disposable income you have after paying all of your monthly bills and loans.</p>


                         <BudgetPieChart
                         loans={props.loans}
                         incomes={props.incomes}
                         deductions={props.deductions}
                         />


                    </div>
               </div> 
          </div>
     )
}