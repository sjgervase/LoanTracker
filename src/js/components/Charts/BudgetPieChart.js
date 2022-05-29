import BigNumber from "bignumber.js";
import React from "react";

import { 
     ResponsiveContainer,
     PieChart,
     Pie,
     Cell,
     Tooltip, 
     Legend,
     Label

} from "recharts";



export default function BudgetPieChart(props) {

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
          for (let i = 0; i < props.loans?.length; i++) {
               // ensure it is not labeled as paid off
               if (!props.loans[i].loan.PaidOff) {
                    dataArray.push({
                         "name": props.loans[i].loan.LoanName,
                         "value": parseFloat(props.loans[i].loan.MonthlyPayment),
                         "color": loanColor
                    });
               }
          }

          // deductions
          for (let i = 0; i < props.deductions?.length; i++) {

               // if bill
               if (props.deductions[i].Type == "bill") {
                    dataArray.push({
                         "name": props.deductions[i].Name,
                         "value": parseFloat(props.deductions[i].MonthlyAmount),
                         "color": billColor
                    });

               // expense
               } else if(props.deductions[i].Type == "expense") {
                    dataArray.push({
                         "name": props.deductions[i].Name,
                         "value": parseFloat(props.deductions[i].MonthlyAmount),
                         "color": expenseColor
                    });
               }
          }
          
          // do savings in a seperate loop to ensure expenses and bills are next to each other on the chart
          for (let i = 0; i < props.deductions?.length; i++) {
                // else savings
               if (props.deductions[i].Type == "savings") {
                    dataArray.push({
                         "name": props.deductions[i].Name,
                         "value": parseFloat(props.deductions[i].MonthlyAmount),
                         "color": savingsColor
                    });
               }
          }


          // income should be a singular item, calculated by adding all incomes and subtracting all bills and loans
          // then push "remaining income" if available
          let incomeTotal = new BigNumber(0);
          for (let i = 0; i < props.incomes?.length; i++) {
               let currentIncome = new BigNumber(props.incomes[i].MonthlyAmount);
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
          for (let i = 0; i < props.loans?.length; i++) {
               vals.push(parseFloat(props.loans[i].loan.MonthlyPayment));
          }

          // get all values from deductions
          for (let i = 0; i < props.deductions?.length; i++) {
               vals.push(parseFloat(props.deductions[i].MonthlyAmount));
          }

          // add all remaining values up and utilize javascript's number formating
          let sum = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(vals.reduce((partialSum, a) => partialSum + a, 0));
          
          return (
               <React.Fragment>
                    <text x={cx} y={cy}>
                         <tspan
                         style={{
                              fontWeight: 700,
                              fontSize: "1.5em",
                              fill: "#212529",
                              textAnchor: 'middle' 
                         }}>

                              {sum}

                         </tspan>
                    </text>

                    <text x={cx} y={cy + 16}>
                         <tspan
                         style={{
                              fontSize: "0.8em",
                              fill: "#36733F",
                              textAnchor: 'middle' 
                         }}>

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
                    <div className="customLineChartTooltip">
                         <span>{e.payload[0].payload["name"]}</span>
                         
                         <span>
                              {new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(parseFloat(
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
          <ResponsiveContainer width="99%" height={500}>
               
               <PieChart>
               <Tooltip content={customTooltip} />
               
                    <Pie 
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    color="color"
                    innerRadius={110}
                    label={(entry) => entry.name  + " " + new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(parseFloat(entry.value))}
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