import React from "react";


export default function RecentlyRecordedPayments(props) {
     // console.log(props);

     function paymentHistoryData() {
          

          let dataArray = [];

          if (props.data?.length > 0) {
               // for each loan within all loans data
               for (let i = 0; i < props.data?.length; i++) {
                    
                    // for each item within the payment history of each loan
                    for (let j = 0; j < props.data[i].loan.PaymentHistory.length; j++) {
                         // dataArray.push(props.data[i].loan.PaymentHistory[j]);

                         dataArray.push({
                              "loanName": props.data[i].loan.LoanName,
                              "loanColor": props.data[i].loan.LoanColor,
                              "amount": "$" + new Intl.NumberFormat().format(props.data[i].loan.PaymentHistory[j].amount),
                              "dateMade": props.data[i].loan.PaymentHistory[j].dateMade,
                              "dateRecorded": props.data[i].loan.PaymentHistory[j].dateRecorded
                         })

                         console.log(dataArray.length);
                         
                    }

               }
          }

          // sort so newest are first
          dataArray.sort(function(a,b){
               // Turn your strings into dates, and then subtract them
               // to get a value that is either negative, positive, or zero.
               return new Date(b.dateRecorded) - new Date(a.dateRecorded);
          });

          return dataArray
     } 

     let paymentHistoryArray = paymentHistoryData();


     console.log(paymentHistoryArray);


     

     // map for each payment history array, sorting by dateRecorded
     return(
          <>
          {paymentHistoryArray.map(payment => 
               <div>
                    <span>{payment.loanName}</span>
               </div>
          
          
          )}


          </>
     );
}