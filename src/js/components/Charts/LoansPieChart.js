import React from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

import { 
     ResponsiveContainer,
     PieChart,
     Pie,
     Cell,
     Tooltip, 
     Legend,
     Label
} from "recharts";



export default function LoansPieChart() {

     // get data from redux store
     // only loans are needed
     const loansState = useSelector((state) => state.loans);

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     // format data for pie chart
     function rechartData() {
          // create empty array to be populated
          let dataArray = [];

          // for each loan
          for (let i = 0; i < loansState.loans.length; i++) {
               // if not paid off
               if (!loansState.loans[i].loan.PaidOff) {
                    dataArray.push({
                         "name": loansState.loans[i].loan.LoanName,
                         "value": parseFloat(loansState.loans[i].loan.CalculatedRemainingAmount),
                         "color": loansState.loans[i].loan.LoanColor
                    });     
               }
          }
     
          return dataArray
     }
     // run above function to generate piechart data
     let pieData = rechartData();


     // pie chart pulls colors in order, so loan[0] needs loan[0].color
     function rechartColors() {
          var colorsArray = [];
          for (let i = 0; i < pieData.length; i++) {
               colorsArray.push(pieData[i].color)
          }
          return colorsArray;
     }
     // run above function to generate color data
     let colors = rechartColors();

      
     // function to generate custom piechart label ----- courtesy of https://celiaongsl.medium.com/2-secret-pie-chart-hacks-to-up-your-recharts-game-hack-recharts-1-9fa62ff9416a
     const CustomLabel = ({ viewBox}) => {
          const { cx, cy } = viewBox;

          // all values total
          let vals = [];

          // get all Calculated Remaining Amounts from pie data
          for (let i = 0; i < pieData.length; i++) {
               vals.push(pieData[i].value);
          }

          // add all remaining values up and run function to format money
          let sum = moneyFormatter(vals.reduce((partialSum, a) => partialSum + a, 0))

          return (
               <React.Fragment>
                    <text x={cx} y={cy}>
                         <tspan className="pieChartCenterTextTop">
                              {sum}
                         </tspan>
                    </text>

                    <text x={cx} y={cy + 16}>
                         <tspan className="pieChartCenterTextBottom">
                              current loans remaining
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
                              {"Remaining: " + moneyFormatter(
                                   parseFloat(
                                        e.payload[0].payload["value"]
                                   )
                              )}
                         </span>
                    </div>
               );
          }
          else {
               return "";
          }
     }

     
     return(
          <ResponsiveContainer width="99%" height="100%">
               
               <PieChart>
               
               <Legend layout="horizontal" verticalAlign="bottom" align="left" />
               <Tooltip content={customTooltip} />
               
                    <Pie 
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    color="color"
                    outerRadius="90%"
                    innerRadius="60%"
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