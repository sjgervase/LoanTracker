import React, { useEffect, useState } from "react";

import CurrencyInput from "react-currency-input-field";

import { Button, Form, Modal, Table } from "react-bootstrap";

import { BigNumber } from "bignumber.js"

import { ipcRenderer } from "electron";







export default function AdjustMonthlyPaymentModal(props) {

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     // state for showing or hiding the modal
     const [showModal, setShowModal] = useState(false);


     // state to keep track of the current monthly payment and user selected range for slider / currency input functionality
     const [rangeValueState, setRangeValueState] = useState();



     // functions to show or hide the record payment modal
     const showAdjustMonthlyPaymentFunc = () => {
          setShowModal(true);
          // set the range value on open
          setRangeValueState(
               Number(props.loan?.loan.MonthlyPayment)
          )
     };
     
     
     const hideAdjustMonthlyPaymentFunc = () => {
          // clear the value state
          setRangeValueState(
               Number(props.loan?.loan?.MonthlyPayment)
          );
          // hide the modal
          setShowModal(false);
     }


     // function to calculate new desired payback
     // doing it this way as down the line i would like to output a CSV list of all payments, but at the moment will just return some numbers
     function repaymentInterestCalculator(monthlyPayment) {
          
          // create an empty array to calculate all interest payments
          let interestPaymentsArray = [];

          // get the total amount
          let totalLoanAmountBN = new BigNumber(props.loan?.loan.TotalLoanAmount);

          // get the monthly payment
          let monthlyPaymentBN = new BigNumber(monthlyPayment);

          // get the total payments
          let terms = totalLoanAmountBN.div(monthlyPaymentBN);

          // get the interest rate and convert it to decimal 
          let interestRateBN = new BigNumber(props.loan?.loan.InterestRate);
          interestRateBN = interestRateBN.dividedBy(100);

          // for each term
          for (let i = 0; i < terms; i++) {
               // divide interest rate by 12 and multiply by totalLoanAmount
               // this gives us the amount of that payment which is interest
               let interestPayment = interestRateBN.dividedBy(12).multipliedBy(totalLoanAmountBN);
               
               // push this amount to the array
               interestPaymentsArray.push(interestPayment.toNumber());

               // subtract the monthly payment from the the total
               totalLoanAmountBN -= monthlyPaymentBN;
          }

          let totalInterestPaid = interestPaymentsArray.reduce((partialSum, a) => partialSum + a, 0);

          return totalInterestPaid.toFixed(2);
     }




     function repaymentTermCalculator(monthlyPayment) {
          // get the total amount
          let totalLoanAmountBN = new BigNumber(props.loan?.loan.TotalLoanAmount);

          // get the monthly payment
          let monthlyPaymentBN = new BigNumber(monthlyPayment);

          // get the total payments
          let terms = totalLoanAmountBN.div(monthlyPaymentBN);

          return terms.toFixed(0);
     }



     // function to submit entered data from "adjust monthly payment modal"
     function submitDesiredMonthlyPayment() {

          let monthlyPaymentSubmission = {
               GUID: props.loan?.loan.GUID,
               value: rangeValueState
          }

          ipcRenderer.invoke('desiredMonthlyPaymentSubmission', (monthlyPaymentSubmission));
          // hide the modal
          setShowModal(false);
     }
     

     


     return(
          <>
               <Button variant="primary" size="lg"
               onClick={showAdjustMonthlyPaymentFunc}>
                    Adjust Monthly Amount
               </Button>


               <Modal
                    show={showModal}
                    onHide={hideAdjustMonthlyPaymentFunc}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                    centered>

                    <Modal.Header closeButton>
                         <Modal.Title>Adjust your Monthly Payment</Modal.Title>
                    </Modal.Header>


                    <Modal.Body>
                         <p className="lead">Paying more than the minimum required amount can allow you to pay off loans quicker AND pay less overall interest</p>

                         <Form.Group className="mb-3 loanItemViewRangeSlider">

                              <div className="rangeSelectorFull">
                                   {/* darn floating point numbers expressed in binary */}
                                   <h1>{rangeValueState ==  parseFloat(props.loan?.loan?.MonthlyPayment) || isNaN(rangeValueState) ? "---" : "$" + ((rangeValueState*100) - (parseFloat(props.loan.loan.MonthlyPayment)*100))/100}</h1>
                                   <span className="text-muted">more per month</span>
                              </div>

                              <div className="rangeSelectorSmall">
                                   <h3>${parseFloat(props.loan?.loan?.MonthlyPayment)}</h3>
                                   <Form.Label>Minimum Montly Payment</Form.Label>
                              </div>

                              <div className="rangeSelectorLarge">
                                   <Form.Range
                                   min={parseFloat(props.loan?.loan?.MonthlyPayment)}
                                   max={5 * parseFloat(props.loan?.loan?.MonthlyPayment)}
                                   value={rangeValueState}
                                   onChange={e => setRangeValueState(e.target.value)}
                                   />
                              </div>

                              <div className="rangeSelectorSmall">
                                   <h3>{rangeValueState ==  parseFloat(props.loan?.loan?.MonthlyPayment) || isNaN(rangeValueState) ? "---" : "$" + rangeValueState}</h3>
                                   <Form.Label>New Montly Payment</Form.Label>
                              </div>

                              <div className="rangeSelectorFull">
                                   <div className="rangeSelectorInputHolder">
                                        <Form.Label>Alternatively, you may enter a desired number</Form.Label>
                                        <CurrencyInput
                                        prefix="$"
                                        name="desiredMonthlyPayment"
                                        placeholder="or, enter a value"
                                        decimalScale={2}
                                        decimalsLimit={2}
                                        maxLength={8}
                                        value={rangeValueState}
                                        onValueChange={(value) => setRangeValueState(Number(value))}
                                        />
                                   </div>
                              </div>

                         </Form.Group>

                         <div className="adjustedPaymentResult">
                              {/* not going with an actual table as i may show or hide additional columns */}

                              <div className="adjustedPaymentResultColumn columnTitles">
                                   <span>Total Payback Amount</span>
                                   <span>Total Interest Paid</span>
                                   <span>Total Payments</span>
                              </div>

                              <Table>
                                   <thead>
                                        <tr>
                                             <th></th>
                                             <th>New Payment: {moneyFormatter(rangeValueState)}</th>
                                             <th>Old Payment: ${parseFloat(props.loan?.loan?.MonthlyPayment)}</th> 
                                        </tr>
                                   </thead>
                                   
                                   <tbody>
                                        <tr>
                                             <td>Total Payments</td>

                                             <td>{repaymentTermCalculator(rangeValueState)} terms</td>

                                             <td>{repaymentTermCalculator(props.loan?.loan.MonthlyPayment)} terms</td>
                                             
                                        </tr>
                                        <tr>
                                             <td>Total Interest Paid</td>
                                             
                                             <td>
                                                  {moneyFormatter(repaymentInterestCalculator(rangeValueState))}
                                             </td>
                                             
                                             <td>
                                                  {moneyFormatter(repaymentInterestCalculator(props.loan?.loan.MonthlyPayment))}
                                             </td>
                                        
                                        </tr>
                                   </tbody>
                              </Table>

                         </div>

                    </Modal.Body>




                    <Modal.Footer>
                         <Button variant="outline-danger" onClick={() => hideAdjustMonthlyPaymentFunc()}>
                              Cancel
                         </Button>

                         <Button variant="success" onClick={() => submitDesiredMonthlyPayment()}
                         disabled={rangeValueState == Number(props.loan?.loan.MonthlyPayment) ? true : false}>
                              Record
                         </Button>
                    </Modal.Footer>

               </Modal>
          </>
     );
}