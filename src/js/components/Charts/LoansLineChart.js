import React from "react";

import { 
     ResponsiveContainer,
     AreaChart,
     CartesianGrid,
     XAxis,
     YAxis,
     Tooltip,
     Area

} from "recharts";



export default function LoansLineChart(props) {

     // https://celiaongsl.medium.com/2-secret-pie-chart-hacks-to-up-your-recharts-game-hack-recharts-1-9fa62ff9416a

     // console.log(props);

     // pull this into the loan item view function? I need the running total data in many places


     // function to format date to DD-MM-YYYY
     function formatDate (input) {
          var datePart = input.match(/\d+/g),
          year = datePart[0].substring(2), // get only two digits
          month = datePart[1], day = datePart[2];
          
          return month+'/'+day+'/'+year;
     }

     // function to format payment history data from props
     function initialDataFormat() {
          let dataArray = [];

          //  get principal value
          let principal = parseFloat(props.data.TotalLoanAmount);
          // get disbursement date (also adding timestamp for proper conversion)
          let disbursement = new Date(props.data.DisbursementDate.concat(' 00:00'));

          // push these initial values to the array (at beginning)
          dataArray.push({
               "dateForShow": formatDate(props.data.DisbursementDate),
               "dateForOrder": disbursement,
               "amount": principal
          });

          // for each item in payment history, add to array
          for (let i = 0; i < props.data.PaymentHistory.length; i++) {
               dataArray.push({
                    "dateForShow": formatDate(props.data.PaymentHistory[i].dateMade),
                    "dateForOrder": new Date(props.data.PaymentHistory[i].dateMade.concat(' 00:00')),
                    "amount": parseFloat(props.data.PaymentHistory[i].amount)
               });
          }

          // for each item in Late Fee history, add to array
          for (let i = 0; i < props.data.LateFees.length; i++) {
               dataArray.push({
                    "dateForShow": formatDate(props.data.LateFees[i].dateMade),
                    "dateForOrder": new Date(props.data.LateFees[i].dateMade.concat(' 00:00')),
                    // dont forget to make this number negative
                    "amount": (parseFloat(props.data.LateFees[i].amount) * -1)
               });
          }
          
          return dataArray;
     }

     let formattedPropsData = initialDataFormat();

     // console.log(formattedPropsData);

     

     // function to turn the formatted data into chart data
     function rechartData(array) {
          let chartData = [];
          // with array formatted in above function, now calculations must be made for plotting.
          // need array with:
               // running total of amount remaining - amount on that payment item
               // dateForShow

          // ordered by date for order. 

          // first item is always principal amount
          chartData.push({
               "currentLoanAmount": array[0].amount,
               "date": array[0].dateForShow
          });

          // remove first item from array param
          array.shift();

          // now, sort by array.dateForOrder and push the results in chronological order 
          array.sort(function(a,b){
               // Turn your strings into dates, and then subtract them
               // to get a value that is either negative, positive, or zero.
               return new Date(a.dateForOrder) - new Date(b.dateForOrder);
          });

          // create running total variable to be affected by the payments recorded
          var runningTotalAmount = chartData[0].currentLoanAmount;

          for (let i = 0; i < array.length; i++) {
               runningTotalAmount -= array[i].amount

               chartData.push({
                    "currentLoanAmount": runningTotalAmount,
                    "date": array[i].dateForShow
               })
               
          }

     
          return chartData;
     }

     let lineChartData = rechartData(formattedPropsData);

     // console.log(lineChartData);

     // Sample data
     // NOTE: it displays the points in the order they are listed in the data array
     // WANT:
          // remaining amount and date added,
          // first data is date added and remaining amount
          // "name" = payment date 
          // "amountPaid" = amount,
          // GOING TO NEED TO KEEP TRACK OF "REMAINING AMOUNT" MINUS ALL PAYMENTS MADE
          // sort by DATE MADE




     // custom tooltip
     const customTooltip = (e) => {

          if (e.active && e.payload!=null && e.payload[0]!=null) {

               return (
                    <div className="customLineChartTooltip">
                         <span>Date: {e.payload[0].payload["date"]}</span>
                         
                         <span>
                              {"Amount: $" + new Intl.NumberFormat().format(
                                   parseFloat(
                                        e.payload[0].payload["currentLoanAmount"]
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
          <ResponsiveContainer width="98%" height={280}>

               <AreaChart
                    data={lineChartData}
               >
                    
                    
                    <XAxis dataKey="date" />
                    <YAxis />
                    
                    <CartesianGrid strokeDasharray="3 3" />
                    
                    <Tooltip content={customTooltip}/>
                    
                    <Area type="monotone" dataKey="currentLoanAmount" stroke={props.data.LoanColor} fill={props.LoanColor}/>

               </AreaChart>

          </ResponsiveContainer>
     );
}