import React from "react";

import { 
     ResponsiveContainer,
     PieChart,
     Pie,
     Cell,
     Sector,
     Tooltip, 
     Legend,
     Label

} from "recharts";



export default function LoansPieChart(props) {

     // https://celiaongsl.medium.com/2-secret-pie-chart-hacks-to-up-your-recharts-game-hack-recharts-1-9fa62ff9416a



     // format data for pie chart
     function rechartData() {
          let dataArray = [];
          for (let i = 0; i < props.data?.length; i++) {
               dataArray.push({
                    "name": props.data?.[i].loan.LoanName,
                    "value": parseFloat(props.data?.[i].loan.RemainingAmount),
                    "color": props.data?.[i].loan.LoanColor
               });
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

          // get all values from props and push to array
          for (let i = 0; i < props.data?.length; i++) {
               vals.push(parseFloat(props.data?.[i].loan.RemainingAmount));
          }

          // add all remaining values up and utilize javascript's number formating
          let sum = "$" + new Intl.NumberFormat().format(vals.reduce((partialSum, a) => partialSum + a, 0))

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
                    <div className="customLineChartTooltip">
                         <span>{e.payload[0].payload["name"]}</span>
                         
                         <span>
                              {"Remaining: $" + new Intl.NumberFormat().format(
                                   parseFloat(
                                        e.payload[0].payload["value"]
                                   ).toFixed(2)
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
          <ResponsiveContainer width="100%" height="100%">
               
               <PieChart>
               
               <Legend layout="horizontal" verticalAlign="bottom" align="left" />
               <Tooltip content={customTooltip} />
               
                    <Pie 
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    color="color"
                    outerRadius={130}
                    innerRadius={85}
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