import React from "react";
import { useNavigate } from "react-router-dom";
import { BigNumber } from "bignumber.js"
import { Button, Popover, OverlayTrigger, Accordion } from "react-bootstrap";
import { FaGraduationCap, FaUser, FaCreditCard, FaInfoCircle } from "react-icons/fa";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";


// import components
import AddMonthlyBillModal from "../components/Modals/AddMonthlyBillModal";
import AddMonthlyExpenseModal from "../components/Modals/AddMonthlyExpenseModal";
import AddMonthlyPayModal from "../components/Modals/AddMonthlyIncomeModal";
import AddMonthlySavingsModal from "../components/Modals/AddMonthlySavingsModal";
import EditOrDeleteBudgetItem from "../components/Modals/EditOrDeleteBudgetItemModal";

import BudgetPieChart from "../components/Charts/BudgetPieChart";
import BudgetLists from "../components/ListMaps/BudgetLists";


export default function SimpleBudget(props) {

     // get data from redux store
     const loansState = useSelector((state) => state.loans);
     const incomesState = useSelector((state) => state.incomes);
     const deductionsState = useSelector((state) => state.deductions);


     // function for total monthly loans
     let monthlyLoansTotal = () => {
          let runningTotal = new BigNumber(0);
          for (let i = 0; i < loansState.loans.length; i++) {
               // if not marked as paid off
               if (!loansState.loans[i].loan.PaidOff) {
                    let currentAmount = new BigNumber(loansState.loans[i].loan.MonthlyPayment);
                    runningTotal = runningTotal.plus(currentAmount);
               }
          }
          return runningTotal.toFixed(2);
     }


     // function for total monthly incomes
     let monthlyIncomesTotal = () => {
          let runningTotal = new BigNumber(0);
          for (let i = 0; i < incomesState.incomes.length; i++) {
               let currentAmount = new BigNumber(incomesState.incomes[i].MonthlyAmount);
               runningTotal = runningTotal.plus(currentAmount);
          }
          return runningTotal.toFixed(2);
     }


     // function for total monthly bills
     let monthlyBillsTotal = () => {
          let runningTotal = new BigNumber(0);
               for (let i = 0; i < deductionsState.deductions.length; i++) {
                    // if bill
                    if (deductionsState.deductions[i].Type == "bill") {
                         let currentAmount = new BigNumber(deductionsState.deductions[i].MonthlyAmount);
                         runningTotal = runningTotal.plus(currentAmount);
                    }
               }
          return runningTotal.toFixed(2);
     }


     // function for total monthly expenses
     let monthlyExpensesTotal = () => {
          let runningTotal = new BigNumber(0);
               for (let i = 0; i < deductionsState.deductions.length; i++) {
                    // if bill
                    if (deductionsState.deductions[i].Type == "expense") {
                         let currentAmount = new BigNumber(deductionsState.deductions[i].MonthlyAmount);
                         runningTotal = runningTotal.plus(currentAmount);
                    }
               }
          return runningTotal.toFixed(2);
     }


     // function for total monthly savings
     let monthlySavingsTotal = () => {
          let runningTotal = new BigNumber(0);
               for (let i = 0; i < deductionsState.deductions.length; i++) {
                    // if bill
                    if (deductionsState.deductions[i].Type == "savings") {
                         let currentAmount = new BigNumber(deductionsState.deductions[i].MonthlyAmount);
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
          let savingsTotal = new BigNumber(monthlySavingsTotal());

          return incomeTotal.minus(loansTotal).minus(billsTotal).minus(expensesTotal).minus(savingsTotal).toFixed(2);
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
          for (let i = 0; i < loansState.loans.length; i++) {
               // if not marked as paid off
               if (!loansState.loans[i].loan.PaidOff) {
                    loansArray.push({
                         "name": loansState.loans[i].loan.LoanName,
                         "value": parseFloat(loansState.loans[i].loan.MonthlyPayment)
                    })
               }
          }

          // bills and expenses
          for (let i = 0; i < deductionsState.deductions.length; i++) {

               // if bill
               if (deductionsState.deductions[i].Type == "bill") {
                    billsArray.push({
                         "name": deductionsState.deductions[i].Name,
                         "value": parseFloat(deductionsState.deductions[i].MonthlyAmount)
                    })

               // if expense
               } else if(deductionsState.deductions[i].Type == "expense") {
                    expensesArray.push({
                         "name": deductionsState.deductions[i].Name,
                         "value": parseFloat(deductionsState.deductions[i].MonthlyAmount)
                    })

               // else savings
               } else {
                    savingsArray.push({
                         "name": deductionsState.deductions[i].Name,
                         "value": parseFloat(deductionsState.deductions[i].MonthlyAmount)
                    })
               }
          }

          // incomes
          for (let i = 0; i < incomesState.incomes.length; i++) {
               incomesArray.push({
                    "name": incomesState.incomes[i].Name,
                    "value": parseFloat(incomesState.incomes[i].MonthlyAmount)
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

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     const addALoanPopover = (
          <Popover id="popover-basic" className="customPopover">
               <Popover.Header as="h3" className="customPopoverHeader">Add A Loan</Popover.Header>
               
               <Popover.Body className="customPopoverBody">
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
                         <div className="moduleHeader"><span>BUDGET TOOLS</span></div>

                         <AddMonthlyPayModal/>

                         <AddMonthlySavingsModal/>

                         <AddMonthlyBillModal/>

                         <AddMonthlyExpenseModal/>

                         <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={addALoanPopover}>
                              <Button onClick={() => addALoanButton()} size="lg"  variant="danger" className="btn-AddALoan shadow-none">
                                   Add A loan
                              </Button>
                         </OverlayTrigger>

                         <EditOrDeleteBudgetItem/>
                    </div>

                    <div className="budgetQuickLook dashboardModule">
                         <div className="moduleHeader"><span>QUICK LOOK</span></div>

                         <div className="budgetLists">
                              <h4>Monthly Incomes Total</h4>
                              <BudgetLists array={incomesArray}/>
                              <h3>{moneyFormatter(monthlyIncomesTotal())}</h3>
                         </div>

                         <div className="budgetTotals">

                              <div className="budgetLists">
                                   <h4>Monthly Savings Total</h4>
                                   <BudgetLists array={savingsArray}/>
                                   <h3>{moneyFormatter(monthlySavingsTotal())}</h3>
                              </div>
                              

                              <div className="budgetLists">
                                   <h4>Monthly Loans Total</h4>
                                   <BudgetLists array={loansArray}/>
                                   <h3>{moneyFormatter(monthlyLoansTotal())}</h3>
                              </div>

                              <div className="budgetLists">
                                   <h4>Monthly Bills Total</h4>
                                   <BudgetLists array={billsArray}/>
                                   <h3>{moneyFormatter(monthlyBillsTotal())}</h3>
                              </div>

                              <div className="budgetLists">
                                   <h4>Monthly Expenses Total</h4>
                                   <BudgetLists array={expensesArray}/>
                                   <h3>{moneyFormatter(monthlyExpensesTotal())}</h3>
                              </div>
                         </div>

                         <div className="budgetLists">

                              <h4>Total Remaining Income</h4>
                              <h3>
                                   {moneyFormatter(remainderTotal())}
                              </h3>

                         </div>

                    </div>
               </div>


               <div className="budgetBottomRow">

                    <div className="pieChart dashboardModule">
                         
                         <div className="moduleHeader"><span>TOTALS BREAKDOWN</span></div>

                         <p>The pie chart below is a representation of your loans and bills compared to your incomes. The entire pie represents your average monthly income. The less green you in chart, the less disposable income you have after paying all of your monthly bills, expenses, and loans.</p>


                         <BudgetPieChart/>


                    </div>
               </div> 
          </div>
     )
}