import React, { useContext } from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import components
import DeletePaymentLateFeeModal from "../Modals/DeletePaymentLateFeeModal";

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






     // note: all payment/late fee items will have a unique dateRecorded property as two cannot be made at the same time

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     // function to set border style
     function borderStyle(color) {
          if (color !="") {
               return {
                    border: "1px solid" + color,
                    borderLeft: "5px solid" + color
               }
          }
     }


     // function to format if the item is a payment or a latefee
     function paymentFormatType(amount, type) {
          if (type == "payment") {
               return(
                    <>
                         <span>payment: </span>
                         <span className="payment">-{moneyFormatter(amount)}</span>
                    </>
               )
          } else {
               return(
                    <>
                         <span>fee: </span>
                         <span className="lateFee">+{moneyFormatter(amount)}</span>
                    </>
               )
          }
     }

     function datesFormat(dateMade) {
          var months = {"Jan":"January", "Feb":"February", "Mar":"March", "Apr":"April", "May":"May", "Jun":"June", "Jul":"July", "Aug":"August", "Sep":"September", "Oct":"October", "Nov":"November", "Dec":"December"};

          var yearMade = dateMade.substring(0,4);
          var monthMade = dateMade.substring(5,7);
          var dayMade = dateMade.substring(8,10);

          var dateMadeFormatted = new Date(yearMade, monthMade-1, dayMade).toDateString();

          // get full month
          for (var prop in months) {
               if (new RegExp(prop).test(dateMadeFormatted)) {
                    // replace abbreviated month with full month name
                    dateMadeFormatted = dateMadeFormatted.replace(prop, months[prop]);    
                    // replace day with day followed by comma `,` character
                    dateMadeFormatted = dateMadeFormatted.replace(/(\d{2})(?=\s)/, "$1,");
               }
          }

          return(
               <span>made on: {dateMadeFormatted}</span>
          )
     }

     // map for each payment history array, sorting by dateRecorded
     return(
          
          <div className="listContainer">

               <div className="list">
               {paymentHistoryArray.map((paymentORfee, index) => 
                    
                    <div className="paymentOrFeeItem" style={borderStyle(paymentORfee.loanColor)} key={index}>

                         <div className="paymentOrFeeItemName">
                              <span>{paymentORfee.loanName}</span>
                         </div>
                         

                         <div className="paymentOrFeeItemAmount">
                              <span>{paymentFormatType(paymentORfee.amount, paymentORfee.type)}</span>
                         </div>

                         <div className="paymentOrFeeItemAmountDates">
                              <span>{datesFormat(paymentORfee.dateMade)}</span>
                         </div>

                         <DeletePaymentLateFeeModal item={paymentORfee}/>
                    </div>
               )}
               </div>
          </div>
     );
}