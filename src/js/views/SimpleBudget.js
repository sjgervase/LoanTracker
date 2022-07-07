import React from "react";
import { useNavigate } from "react-router-dom";
import { BigNumber } from "bignumber.js"
import { Button, Popover, OverlayTrigger, Accordion } from "react-bootstrap";
import { FaGraduationCap, FaUser, FaCreditCard, FaInfoCircle } from "react-icons/fa";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";


// import components
import AddBudgetItemModal from "../components/Modals/AddBudgetItemModal";
import EditOrDeleteBudgetItem from "../components/Modals/EditOrDeleteBudgetItemModal";

import BudgetPieChart from "../components/Charts/BudgetPieChart";
import BudgetLists from "../components/ListMaps/BudgetLists";


export default function SimpleBudget() {

     // get data from redux store
     const loansState = useSelector((state) => state.loans);
     const incomesState = useSelector((state) => state.incomes);
     const deductionsState = useSelector((state) => state.deductions);
     // console.log(deductionsState);


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
                         "frequency": deductionsState.deductions[i].Frequency,
                         "value": parseFloat(deductionsState.deductions[i].MonthlyAmount)
                    })

               // if expense
               } else if(deductionsState.deductions[i].Type == "expense") {
                    expensesArray.push({
                         "name": deductionsState.deductions[i].Name,
                         "frequency": deductionsState.deductions[i].Frequency,
                         "value": parseFloat(deductionsState.deductions[i].MonthlyAmount)
                    })

               // else savings
               } else {
                    savingsArray.push({
                         "name": deductionsState.deductions[i].Name,
                         "frequency": deductionsState.deductions[i].Frequency,
                         "value": parseFloat(deductionsState.deductions[i].MonthlyAmount)
                    })
               }
          }

          // incomes
          for (let i = 0; i < incomesState.incomes.length; i++) {
               incomesArray.push({
                    "name": incomesState.incomes[i].Name,
                    "frequency": incomesState.incomes[i].Frequency,
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
               <h5>Use this simply budgeting tool to help prepare your finances on a month by month basis</h5>
               
               <div className="dashboardModulesContainer" style={{backgroundColor:"red"}}>

                    <div className="budgetTools dashboardModule">
                         <div className="moduleHeader">
                              <h2>Budget Tools</h2>
                         </div>

                         <div className="moduleContent">
                              <AddBudgetItemModal type="income"/>
                              <AddBudgetItemModal type="savings"/>
                              <AddBudgetItemModal type="bill"/>
                              <AddBudgetItemModal type="expense"/>

                              {/* add a loan is unique as this button directs you to the form */}
                              <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={addALoanPopover}>
                                   <Button onClick={() => addALoanButton()} size="lg"  variant="danger" className="btn-AddALoan shadow-none">
                                        Add A loan
                                   </Button>
                              </OverlayTrigger>

                              <EditOrDeleteBudgetItem/>
                         </div>
                    </div>


                    <div className="incomesAndDeductions dashboardModule">
                         <div className="moduleHeader">
                              <h2>Incomes, Bills, Loans, & Expenses</h2>
                         </div>

                         <div className="moduleContent">
                              <div className="budgetListsGrid">

                                   <div className="incomesBudgetList budgetList">
                                        <h5>Monthly Incomes Total</h5>
                                        <BudgetLists array={incomesArray}/>
                                        <h3>{moneyFormatter(monthlyIncomesTotal())}</h3>
                                   </div>

                                   <div className="budgetTotals">
                                        <div className="budgetList budgetListsDeductions">
                                             <h5>Monthly Savings Total</h5>
                                             <BudgetLists array={savingsArray}/>
                                             <h3 className="budgetListGrandTotal">{moneyFormatter(monthlySavingsTotal())}</h3>
                                        </div>

                                        <div className="budgetList budgetListsDeductions">
                                             <h5>Monthly Loans Total</h5>
                                             <BudgetLists array={loansArray}/>
                                             <h3 className="budgetListGrandTotal">{moneyFormatter(monthlyLoansTotal())}</h3>
                                        </div>

                                        <div className="budgetList budgetListsDeductions">
                                             <h5>Monthly Bills Total</h5>
                                             <BudgetLists array={billsArray}/>
                                             <h3 className="budgetListGrandTotal">{moneyFormatter(monthlyBillsTotal())}</h3>
                                        </div>

                                        <div className="budgetList budgetListsDeductions">
                                             <h5>Monthly Expenses Total</h5>
                                             <BudgetLists array={expensesArray}/>
                                             <h3 className="budgetListGrandTotal">{moneyFormatter(monthlyExpensesTotal())}</h3>
                                        </div>
                                   </div>

                                   <div className="totalRemainingIncome budgetList">
                                        <h5>Total Remaining Income</h5>
                                        <h3 className="budgetListGrandTotal">{moneyFormatter(remainderTotal())}</h3>
                                   </div>
                              </div>

                         </div>
                    </div>

                    <div className="totalsBreakdown dashboardModule">
                         <div className="moduleHeader">
                              <h2>Totals Breakdown</h2>
                         </div>

                         <div className="moduleContent">
                              <p>The pie chart below is a representation of your loans and bills compared to your incomes. The entire pie represents your average monthly income. The less green you in chart, the less disposable income you have after paying all of your monthly bills, expenses, and loans.</p>

                              <BudgetPieChart/>
                         </div>
                    </div>

               </div>
          </div>
     )
}