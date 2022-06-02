import React, { useContext } from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import components
import PaymentLateFeeItem from "./PaymentLateFeeItem";

export default function RecentlyRecordedPayments(props) {


     // get data from redux store
     // only loans are needed
     const data = useSelector((state) => state.data[0]);

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);


     // function to return the current loan
     function getCurrentLoan(GUID) {
          let currentLoan;
          // if data exists
          if (data) {
               // find the clicked on loan based on the passed state out of all available loans
               currentLoan = data.loans.find(obj => obj.loan.GUID === GUID);
          }
          return currentLoan;
     }


     function paymentHistoryData() {
          // create empty array to be populated
          let dataArray = [];

          // if this field exists, then this component is being viewed in a specific loan item
          if (props.thisLoan) {

               const currentLoan = getCurrentLoan(props.thisLoan);

               // for each item within the payment history of each loan
               for (let j = 0; j < currentLoan.loan.PaymentHistory.length; j++) {
                    dataArray.push({
                         "loanName": currentLoan.loan.LoanName,
                         "loanGUID": currentLoan.loan.GUID,
                         "loanColor": currentLoan.loan.LoanColor,
                         "type": "payment",
                         "amount": moneyFormatter(currentLoan.loan.PaymentHistory[j].amount),
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
                         "amount": moneyFormatter(currentLoan.loan.LateFees[j].amount),
                         "dateMade": currentLoan.loan.LateFees[j].dateMade,
                         "dateRecorded": currentLoan.loan.LateFees[j].dateRecorded
                    })
               }               
          
          // else the component is being viewed on the dashboard
          } else {
               // if data exists
               if (data) {
                    if (data.loans.length > 0) {
                         // for each loan within all loans data
                         for (let i = 0; i < data.loans.length; i++) {
     
                              // for each item within the payment history of each loan
                              for (let j = 0; j < data.loans[i].loan.PaymentHistory.length; j++) {
                                   dataArray.push({
                                        "loanName": data.loans[i].loan.LoanName,
                                        "loanGUID": data.loans[i].loan.GUID,
                                        "loanColor": data.loans[i].loan.LoanColor,
                                        "type": "payment",
                                        "amount": moneyFormatter(data.loans[i].loan.PaymentHistory[j].amount),
                                        "dateMade": data.loans[i].loan.PaymentHistory[j].dateMade,
                                        "dateRecorded": data.loans[i].loan.PaymentHistory[j].dateRecorded
                                   })
                              }
          
                              // for each item within the late fees of each loan
                              for (let j = 0; j < data.loans[i].loan.LateFees.length; j++) {
                                   dataArray.push({
                                        "loanName": data.loans[i].loan.LoanName,
                                        "loanGUID": data.loans[i].loan.GUID,
                                        "loanColor": data.loans[i].loan.LoanColor,
                                        "type": "lateFee",
                                        "amount": moneyFormatter(data.loans[i].loan.LateFees[j].amount),
                                        "dateMade": data.loans[i].loan.LateFees[j].dateMade,
                                        "dateRecorded": data.loans[i].loan.LateFees[j].dateRecorded
                                   })
                              }
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