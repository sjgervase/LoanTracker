import React from "react";
import BigNumber from "bignumber.js";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

import {
     ResponsiveContainer,
     PieChart,
     Pie,
     Cell,
     Tooltip,
     Label
} from "recharts";



export default function BudgetPieChart() {

     // get data from redux store
     const loansState = useSelector((state) => state.loans);
     const incomesState = useSelector((state) => state.incomes);
     const deductionsState = useSelector((state) => state.deductions);


     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     // https://celiaongsl.medium.com/2-secret-pie-chart-hacks-to-up-your-recharts-game-hack-recharts-1-9fa62ff9416a
     // format data for pie chart
     function rechartData() {
          let dataArray = [];

          // 3 colors to denote loans, bills, expenses, savings, and incomes
          let incomeColor = "#36733F";
          let loanColor = "#8F0E1D";
          let billColor = "#FF4A5F";
          let expenseColor = "#DB2A3F";
          let savingsColor = "#3FB559";

          // loans
          for (let i = 0; i < loansState.loans.length; i++) {
               // ensure it is not labeled as paid off
               if (!(loansState.loans[i].loan.PaidOff)) {
                    dataArray.push({
                         "name": loansState.loans[i].loan.LoanName,
                         "value": parseFloat(loansState.loans[i].loan.MonthlyPayment),
                         "color": loanColor
                    });
               }
          }

          // deductions
          // seperate these so the colors are next to each other
          // expense
          for (let i = 0; i < deductionsState.deductions.length; i++) {
               if(deductionsState.deductions[i].Type == "expense") {
                    dataArray.push({
                         "name": deductionsState.deductions[i].Name,
                         "value": parseFloat(deductionsState.deductions[i].MonthlyAmount),
                         "color": expenseColor
                    });
               }
          }

          // bill
          for (let i = 0; i < deductionsState.deductions.length; i++) {
               if (deductionsState.deductions[i].Type == "bill") {
                    dataArray.push({
                         "name": deductionsState.deductions[i].Name,
                         "value": parseFloat(deductionsState.deductions[i].MonthlyAmount),
                         "color": billColor
                    });
               }
          }

          // savings
          for (let i = 0; i < deductionsState.deductions.length; i++) {
               if (deductionsState.deductions[i].Type == "savings") {
                    dataArray.push({
                         "name": deductionsState.deductions[i].Name,
                         "value": parseFloat(deductionsState.deductions[i].MonthlyAmount),
                         "color": savingsColor
                    });
               }
          }


          // income should be a singular item, calculated by adding all incomes and subtracting all bills and loans
          // then push "remaining income" if available
          let incomeTotal = new BigNumber(0);
          for (let i = 0; i < incomesState.incomes.length; i++) {
               let currentIncome = new BigNumber(incomesState.incomes[i].MonthlyAmount);
               incomeTotal = incomeTotal.plus(currentIncome);
          }

          // for each item that has been added to data array,
          // subtract all bills and loans from incomeTotal;
          for (let i = 0; i < dataArray.length; i++) {
               let currentReduction = new BigNumber(dataArray[i].value);
               incomeTotal = incomeTotal.minus(currentReduction);
          }

          // if the remaining income total is greater than zero, add it, otherwise the chart breaks
          // bignumber compared to returns -1 if less than or 0 if equal
          if (incomeTotal.comparedTo(0) > 0) {
               dataArray.push({
                    "name": "Remaining Income",
                    "value": parseFloat(incomeTotal.toFixed(2)),
                    "color": incomeColor
               })
          }

          return dataArray
     }
     let pieData = rechartData();


     // pie chart pulls colors in order, so loan[0] needs loan[0].color
     function rechartColors() {
          var colorsArray = [];
          for (let i = 0; i < pieData.length; i++) {
               colorsArray.push(pieData[i].color)
          }
          return colorsArray;
     }

     let colors = rechartColors();



     // function to generate custom piechart label ----- courtesy of https://celiaongsl.medium.com/2-secret-pie-chart-hacks-to-up-your-recharts-game-hack-recharts-1-9fa62ff9416a
     const CustomLabel = ({ viewBox}) => {
          const { cx, cy } = viewBox;

          // all values total
          let vals = [];

          // get all values from loans
          for (let i = 0; i < loansState.loans.length; i++) {
               // if not paid off
               if (!(loansState.loans[i].loan.PaidOff)) {
                    vals.push(parseFloat(loansState.loans[i].loan.MonthlyPayment));
               }
          }

          // get all values from deductions
          for (let i = 0; i < deductionsState.deductions.length; i++) {
               vals.push(parseFloat(deductionsState.deductions[i].MonthlyAmount));
          }

          // add all remaining values up and utilize javascript's number formating
          let sum = moneyFormatter(vals.reduce((partialSum, a) => partialSum + a, 0));

          return (
               <React.Fragment>
                    <text x={cx} y={cy}>
                         <tspan className="pieChartCenterTextTop">
                              {sum}
                         </tspan>
                    </text>

                    <text x={cx} y={cy + 16}>
                         <tspan className="pieChartCenterTextBottom">
                              total nondisposable amount
                         </tspan>
                    </text>
               </React.Fragment>
          );
     };


     // custom tooltip
     const customTooltip = (e) => {
          if (e.active && e.payload!=null && e.payload[0]!=null) {

               return (
                    <div className="customChartTooltip">
                         <span>{e.payload[0].payload["name"]}</span>

                         <span>
                              {moneyFormatter(parseFloat(
                                        e.payload[0].payload["value"]
                              ))}
                         </span>
                    </div>
               );
          }
          else {
               return "";
          }
     }

     return(
          <ResponsiveContainer width="99%" height="90%">

               <PieChart>
               <Tooltip content={customTooltip} />

                    <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    color="color"
                    outerRadius="90%"
                    innerRadius="60%"
                    label={(entry) => entry.name  + " " + moneyFormatter(parseFloat(entry.value))}
                    >

                         <Label
                         content={<CustomLabel/>}
                         position="center"
                         align="center"
                         />

                         {pieData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                         ))}

                    </Pie>

               </PieChart>

          </ResponsiveContainer>

     );
}
