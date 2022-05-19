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

     // function to format date to DD-MM-YYYY
     function formatDate (input) {
          if (props.data) {
               var datePart = input.match(/\d+/g),
               year = datePart[0].substring(2), // get only two digits
               month = datePart[1], day = datePart[2];
          
               return month+'/'+day+'/'+year;
          }
     }
     

     // function to format payment history data from props
     function initialDataFormat() {
          let dataArray = [];

          //  get principal value
          let principal = parseFloat(props.data?.loan?.TotalLoanAmount);
          // get disbursement date (also adding timestamp for proper conversion)
          let disbursement = new Date(props.data?.loan?.DisbursementDate.concat(' 00:00'));

          // push these initial values to the array (at beginning)
          dataArray.push({
               "dateForShow": formatDate(props.data?.loan?.DisbursementDate),
               "dateForOrder": disbursement,
               "amount": principal
          });

          // for each item in payment history, add to array
          for (let i = 0; i < props.data?.loan?.PaymentHistory.length; i++) {
               dataArray.push({
                    "dateForShow": formatDate(props.data?.loan?.PaymentHistory[i].dateMade),
                    "dateForOrder": new Date(props.data?.loan?.PaymentHistory[i].dateMade.concat(' 00:00')),
                    "amount": parseFloat(props.data?.loan?.PaymentHistory[i].amount)
               });
          }

          // for each item in Late Fee history, add to array
          for (let i = 0; i < props.data?.loan?.LateFees.length; i++) {
               dataArray.push({
                    "dateForShow": formatDate(props.data?.loan?.LateFees[i].dateMade),
                    "dateForOrder": new Date(props.data?.loan?.LateFees[i].dateMade.concat(' 00:00')),
                    // dont forget to make this number negative
                    "amount": (parseFloat(props.data?.loan?.LateFees[i].amount) * -1)
               });
          }
          return dataArray;
     }
     let formattedPropsData = initialDataFormat();

     

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

               <AreaChart data={lineChartData}>
                    
                    <XAxis dataKey="date" />
                    <YAxis />
                    
                    <CartesianGrid strokeDasharray="3 3" />
                    
                    <Tooltip content={customTooltip}/>
                    
                    <Area type="monotone" dataKey="currentLoanAmount" stroke={props.data?.loan?.LoanColor} fill={props.data?.loan?.LoanColor}/>

               </AreaChart>

          </ResponsiveContainer>
     );
}