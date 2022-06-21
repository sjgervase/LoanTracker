import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { current } from "@reduxjs/toolkit";

import { ipcRenderer } from "electron";

import BigNumber from "bignumber.js";


// to fetch the loans
export const fetchLoans = createAsyncThunk('fetchLoans', async () => {
     // get response from main process
     const response = await ipcRenderer.invoke('dataRequest');

     // return response, data[0] is the internal array for loans
     return response.data[0].loans;
})

// slice of store to hold all loans
export const LoansSlice = createSlice({
     // name of slice
     name: 'loans',
     
     // initial state
     initialState: {
          loans: [],
          status: 'idle',
          error: null
     },

     // reducers list
     reducers: {
          // reducer to add a loan
          addLoan: (state, action) => {
               // additional function to add properties not recorded by user
               let newLoan = newLoanFunction(action.payload);

               // add to state
               state.loans.push(newLoan);
               
               // finally, send data to main process to write to file
               ipcRenderer.invoke('writeLoans', (["addLoan", newLoan]));
          },

          // reducer to delete a loan
          deleteLoan: (state, action) => {
               // find the index of the loan that the payment needs to be added to by the payload's GUID
               let thisLoanIndex = state.loans.findIndex(loan => loan.loan.GUID === action.payload);

               // remove that item
               state.loans.splice(thisLoanIndex, 1);

               // finally, send data to main process to write to file
               ipcRenderer.invoke('writeLoans', (["deleteLoan", action.payload]));
          },

          // reducer to edit a loan
          editLoan: (state, action) => {
               // TBD
               // state.loans = action.payload;
          },

          // reducer to add an adjusted monthly payment
          adjustMonthlyPayment: (state, action) => {
               // find the loan that the adjusted amount needs to be added to by the payload's GUID
               let thisLoan = state.loans.find(loan => loan.loan.GUID === action.payload.GUID);

               // set the desired monthly payment
               thisLoan.loan.DesiredMonthlyPayment = action.payload.value;

               // finally, send data to main process to write to file
               ipcRenderer.invoke('writeLoans', (["adjustMonthlyPayment", action.payload]));

          },

          // reducer to add a payment or late fee
          addPaymentOrLateFeeToLoan: (state, action) => {
               // find the index of the loan that the payment needs to be added to by the payload's GUID
               let thisLoan = state.loans.find(loan => loan.loan.GUID === action.payload.GUID);

               // create an object to be added to the payment or late fee array
               let itemObject = {
                    amount: action.payload.Amount,
                    dateMade: action.payload.Date,
                    dateRecorded: new Date().toString(),
                    type: action.payload.Type,
                    parentLoan: action.payload.GUID
               }

               // adjust the current remaining amount
               let calcRemainingAmount = new BigNumber(thisLoan.loan.CalculatedRemainingAmount);
               let paymentOrFeeAmount = new BigNumber(action.payload.Amount);

               

               // if type is payment
               if (action.payload.Type == 'payment') {
                    // add the item to the array
                    thisLoan.loan.PaymentHistory.push(itemObject);

                    // subtract the amount from the calculated remaining amount
                    calcRemainingAmount = calcRemainingAmount.minus(paymentOrFeeAmount);
               
               // else is a late fee
               } else {
                    // add the item to the array
                    thisLoan.loan.LateFees.push(itemObject);

                    // add the amount from the calculated remaining amount
                    calcRemainingAmount = calcRemainingAmount.plus(paymentOrFeeAmount);
               }

               // set the calculated remaining amount value
               thisLoan.loan.CalculatedRemainingAmount = calcRemainingAmount.toFixed(2);

               // finally, send data to main process to write to file
               ipcRenderer.invoke('writeLoans', (["addPaymentLateFee", itemObject]));
          },

          // reducer to delete a payment or late fee
          deletePaymentOrLateFee: (state, action) => {
               console.log(action.payload);
               // find the index of the loan that the payment needs to be added to by the payload's GUID
               let thisLoan = state.loans.find(loan => loan.loan.GUID === action.payload.GUID);
               
               // set the property name based on the recieved type
               let propertyName = action.payload.Type;

               // determine payment history / late fee based on recieved type
               let listToUpdate = thisLoan.loan[propertyName];

               // get the index
               let removeThisIndex = listToUpdate.findIndex(item => item.dateRecorded === action.payload.TimeStamp);

               // remove that item
               listToUpdate.splice(removeThisIndex, 1);
               
               // adjust the current remaining amount
               let calcRemainingAmount = new BigNumber(thisLoan.loan.CalculatedRemainingAmount);
               let paymentOrFeeAmount = new BigNumber(action.payload.Amount);

               // if a payment is being deleted
               if (propertyName == "PaymentHistory") {
                    // add the amount back to the loan
                    calcRemainingAmount = calcRemainingAmount.plus(paymentOrFeeAmount);

               // else a late fee is being deleted
               } else {
                    // subtract the amount from the loan
                    calcRemainingAmount = calcRemainingAmount.minus(paymentOrFeeAmount);
               }

               // set the calculated remaining amount value
               thisLoan.loan.CalculatedRemainingAmount = calcRemainingAmount.toFixed(2);

               // finally, send data to main process to write to file
               ipcRenderer.invoke('writeLoans', (["deletePaymentLateFee", action.payload]));
          }
     },

     // extra reducers for fetching data
     extraReducers(builder) {
          builder
               .addCase(fetchLoans.pending, (state, action) => {
                    state.status = 'loading'
               })

               .addCase(fetchLoans.fulfilled, (state, action) => {
                    state.status = 'succeeded';

                    // additional function to add "PaidOff" and "CalculatedRemainingAmount" to each loan item
                    let loans = loanAdditionalFields(action.payload);
                    
                    // add loans to the array
                    state.loans = state.loans.concat(loans);
               })

               .addCase(fetchLoans.rejected, (state, action) => {
                    state.status = 'failed'
                    state.error = action.error.message
               })
     }
})

// export all actions
export const { 
     addLoan,
     deleteLoan,
     editLoan,
     adjustMonthlyPayment,
     addPaymentOrLateFeeToLoan,
     deletePaymentOrLateFee
} = LoansSlice.actions;

// export slice
export default LoansSlice.reducer;

// NOTES:
// https://redux.js.org/tutorials/quick-start
// https://redux.js.org/tutorials/essentials/part-5-async-logic



// function to add additional fields to loans. these are not saved to the file at this time to account for completely up to date loan items
const loanAdditionalFields = (loans) => {

     // for each loan
     for (let i = 0; i < loans.length; i++) {
          // create a BigNumber for the TotalLoanAmount, for all payments to be subtracted
          let currentAmount = new BigNumber(loans[i].loan.TotalLoanAmount);

          // for each late fee, add the fee
          for (let j = 0; j < loans[i].loan.LateFees.length; j++) {
               let lateFeeAmount = new BigNumber(loans[i].loan.LateFees[j].amount);
               currentAmount = currentAmount.plus(lateFeeAmount);
          }

          // for each payment item, subtract the item
          for (let j = 0; j < loans[i].loan.PaymentHistory.length; j++) {
               let paymentAmount = new BigNumber(loans[i].loan.PaymentHistory[j].amount);
               currentAmount = currentAmount.minus(paymentAmount);
          }

          // for BigNumber.js X.comparedTo(Y), returns 1 if X > Y, returns - 1 if X < Y, returns 0 if equal 
          if (currentAmount.comparedTo(0) > 0) {
               // the loan IS NOT paid off
               loans[i].loan.PaidOff = false;
               loans[i].loan.CalculatedRemainingAmount = currentAmount.toFixed(2);

          } else {
               // the loan IS paid off
               loans[i].loan.PaidOff = true;
               loans[i].loan.CalculatedRemainingAmount = "0.00";
          }
     }

     return loans
}


// function for new loans to add additional properties that are not recorded by end user
function newLoanFunction(newLoanData) {
     // calculate total amount
     let monthlyAmount = new BigNumber(newLoanData.formState.MonthlyPayment);
     let totalTermLimit = new BigNumber(newLoanData.formState.TotalTermLength);
     let totalLoanAmount = monthlyAmount.multipliedBy(totalTermLimit);
     
     // create object with payload data and new fields
     let newLoanObject = {
          loan: {
               ...newLoanData.formState,
               GUID: newLoanData.newGUID,
               PaymentHistory: [],
               LateFees: [],
               DesiredMonthlyPayment: 0,
               TotalLoanAmount: totalLoanAmount.toFixed(2),
               PaidOff: false,
               CalculatedRemainingAmount: totalLoanAmount.toFixed(2)
          }
     }

     return newLoanObject;
}