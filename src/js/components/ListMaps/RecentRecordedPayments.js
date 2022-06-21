import React, { useContext } from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import components
import PaymentLateFeeItem from "./PaymentLateFeeItem";

export default function RecentlyRecordedPayments(props) {


     // get data from redux store
     // only loans are needed
     const loansState = useSelector((state) => state.loans);

     function paymentHistoryData() {
          // create empty array to be populated
          let dataArray = [];

          // if this field exists, then this component is being viewed in a specific loan item
          if (props.thisLoan) {

               const currentLoan = loansState.loans.find(obj => obj.loan.GUID === props.thisLoan);

               // for each item within the payment history of each loan
               for (let j = 0; j < currentLoan.loan.PaymentHistory.length; j++) {
                    dataArray.push({
                         "loanName": currentLoan.loan.LoanName,
                         "loanGUID": currentLoan.loan.GUID,
                         "loanColor": currentLoan.loan.LoanColor,
                         "type": "payment",
                         "amount": currentLoan.loan.PaymentHistory[j].amount,
                         "dateMade": currentLoan.loan.PaymentHistory[j].dateMade,
                         "dateRecorded": currentLoan.loan.PaymentHistory[j].dateRecorded
                    })
               }

               // for each item within the late fees of each loan
               for (let j = 0; j < currentLoan.loan.LateFees.length; j++) {
                    dataArray.push({
                         "loanName": currentLoan.loan.LoanName,
                         "loanGUID": currentLoan.loan.GUID,
                         "loanColor": currentLoan.loan.LoanColor,
                         "type": "lateFee",
                         "amount": currentLoan.loan.LateFees[j].amount,
                         "dateMade": currentLoan.loan.LateFees[j].dateMade,
                         "dateRecorded": currentLoan.loan.LateFees[j].dateRecorded
                    })
               }               
          
          // else the component is being viewed on the dashboard
          } else {
               // if data exists
               if (loansState.loans.length > 0) {
                    
                    // for each loan within all loans data
                    for (let i = 0; i < loansState.loans.length; i++) {

                         // for each item within the payment history of each loan
                         for (let j = 0; j < loansState.loans[i].loan.PaymentHistory.length; j++) {
                              dataArray.push({
                                   "loanName": loansState.loans[i].loan.LoanName,
                                   "loanGUID": loansState.loans[i].loan.GUID,
                                   "loanColor": loansState.loans[i].loan.LoanColor,
                                   "type": "payment",
                                   "amount": loansState.loans[i].loan.PaymentHistory[j].amount,
                                   "dateMade": loansState.loans[i].loan.PaymentHistory[j].dateMade,
                                   "dateRecorded": loansState.loans[i].loan.PaymentHistory[j].dateRecorded
                              })
                         }
     
                         // for each item within the late fees of each loan
                         for (let j = 0; j < loansState.loans[i].loan.LateFees.length; j++) {
                              dataArray.push({
                                   "loanName": loansState.loans[i].loan.LoanName,
                                   "loanGUID": loansState.loans[i].loan.GUID,
                                   "loanColor": loansState.loans[i].loan.LoanColor,
                                   "type": "lateFee",
                                   "amount": loansState.loans[i].loan.LateFees[j].amount,
                                   "dateMade": loansState.loans[i].loan.LateFees[j].dateMade,
                                   "dateRecorded": loansState.loans[i].loan.LateFees[j].dateRecorded
                              })
                         }
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