import React from "react";

// import components
import PaymentLateFeeItem from "./PaymentLateFeeItem";

export default function RecentlyRecordedPayments(props) {

     function paymentHistoryData() {

          let dataArray = [];

          if (props.data?.length > 0) {
               // for each loan within all loans data
               for (let i = 0; i < props.data?.length; i++) {
                    
                    // for each item within the payment history of each loan
                    for (let j = 0; j < props.data[i].loan.PaymentHistory.length; j++) {
                         dataArray.push({
                              "loanName": props.data[i].loan.LoanName,
                              "loanGuid": props.data[i].loan.GUID,
                              "loanColor": props.data[i].loan.LoanColor,
                              "type": "payment",
                              "amount": "$" + new Intl.NumberFormat().format(props.data[i].loan.PaymentHistory[j].amount),
                              "dateMade": props.data[i].loan.PaymentHistory[j].dateMade,
                              "dateRecorded": props.data[i].loan.PaymentHistory[j].dateRecorded
                         })
                    }

                    // for each item within the late fees of each loan
                    for (let j = 0; j < props.data[i].loan.LateFees.length; j++) {
                         dataArray.push({
                              "loanName": props.data[i].loan.LoanName,
                              "loanGuid": props.data[i].loan.GUID,
                              "loanColor": props.data[i].loan.LoanColor,
                              "type": "lateFee",
                              "amount": "$" + new Intl.NumberFormat().format(props.data[i].loan.LateFees[j].amount),
                              "dateMade": props.data[i].loan.LateFees[j].dateMade,
                              "dateRecorded": props.data[i].loan.LateFees[j].dateRecorded
                         })
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

     // map for each payment history array, sorting by dateRecorded
     return(
          <div className="paymentFeeList">
               {paymentHistoryArray.map((paymentORfee, index) => 
                    <PaymentLateFeeItem 
                         key={index}
                         item={paymentORfee}
                    />
               )}
          </div>
     );
}