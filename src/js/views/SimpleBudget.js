import React from "react";

import { BigNumber } from "bignumber.js"
import { Button } from "react-bootstrap";

// import components
import AddMonthlyBillModal from "../components/Modals/AddMonthlyBillModal";
import AddMonthlyPayModal from "../components/Modals/AddMonthlyPayModal";

export default function SimpleBudget(props) {

     console.log(props);

     // function for total monthly payment amount
     let monthlyTotal = () => {
          let runningTotal = new BigNumber(0);
          for (let i = 0; i < props.data?.data.length; i++) {
               // if not marked as paid off
               if (!props.data.data[i].loan.PaidOff) {
                    let currentAmount = new BigNumber(props.data.data[i].loan.MonthlyPayment);
                    runningTotal = runningTotal.plus(currentAmount);    
               }
          }
          return runningTotal.toFixed(2);
     }


     return(
          <div className="componentContainer">
               <h1 className="componentTitle">Simple Budgeting Tool</h1>
               <p>get all loan monthly payments, modal to collect and save other bills (name, amount, due date), calculate total spend, get income, compare</p>
               <br></br>
               <p>Use this simply budgeting tool to help prepare your finances on a month by month basis</p>
               
               <AddMonthlyBillModal/>

               <AddMonthlyPayModal/>
               
               <br></br>
               <br></br>
               <span>Monthly Loans Total: {monthlyTotal()}</span>
          </div>
     )
}