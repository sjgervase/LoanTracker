import React from "react";

import { Button } from "react-bootstrap";

export default function PaymentLateFeeItem(props) {

     // note: all payment/late fee items will have a unique dateRecorded property as two cannot be made at the same time

     console.log(props);

     // function to set border style
     function borderStyle(color) {
          if (color !="") {
               return {
                    border: "1px solid" + props.item.loanColor,
                    borderLeft: "5px solid" + props.item.loanColor
               }
          }
     }


     function paymentFormatType(amount, type) {
          if (type == "payment") {
               return(
                    <>
                         <span>payment: </span>
                         <span className="payment">-{amount}</span>
                    </>
               )
          } else {
               return(
                    <>
                         <span>fee: </span>
                         <span className="lateFee">+{amount}</span>
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


     return(
          <div className="paymentOrFeeItem" style={borderStyle(props.item.loanColor)}>

               <div className="paymentOrFeeItemName">
                    <span>{props.item.loanName}</span>
               </div>
               

               <div className="paymentOrFeeItemAmount">
                    <span>{paymentFormatType(props.item.amount, props.item.type)}</span>
               </div>

               <div className="paymentOrFeeItemAmountDates">
                    <span>{datesFormat(props.item.dateMade)}</span>

                    <span>{props.item.loanGUID}</span>
               </div>



               <Button variant="outline-danger" className="btn-sm btn-custom py0">
                    Delete
               </Button>

          </div>
     );

}
