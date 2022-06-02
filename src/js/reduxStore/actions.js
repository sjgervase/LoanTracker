// This action file carries a payload of information from your application to store.
// Redux relies on actions that get dispatched and listened to by reducers, which update the state accordingly.

import { ipcRenderer } from 'electron';

import BigNumber from 'bignumber.js';

import { useDispatch } from 'react-redux';

// action to fetch data from local machine
export const requestData = () => async (dispatch) => {
     dispatch({
          type: 'REQUEST_DATA'
     });

     try {
          const jsonData = await ipcRenderer.invoke('dataRequest');

          paidOffCalculator(jsonData);

          dispatch({
               type: 'RECIEVE_DATA',
               data: jsonData.data,
               isError: false
          });
          
     } catch (error) {
          dispatch({
               type: 'RECIEVE_DATA',
               data: [],
               isError: true
          })
          
     }
}


export const setUserTheme = (currentTheme) => {

     // ternary if to determine new theme
     let newTheme = (currentTheme == 'light' ? 'dark' : 'light');

     console.log(newTheme);
     
     useDispatch({
          type: "SET_USER_THEME",
          currentTheme
     })
}




// function to calculate if a loan is paid off or not
// this is handled on the client side so that all added payments/late fees are shown immediately then updated to file later
const paidOffCalculator = (data) => {
     // for each loan
     for (let i = 0; i < data.data[0].loans.length; i++) {

          // create a BigNumber for the TotalLoanAmount, for all payments to be subtracted
          let currentAmount = new BigNumber(data.data[0].loans[i].loan.TotalLoanAmount);

          // for each late fee, add the fee
          for (let j = 0; j < data.data[0].loans[i].loan.LateFees.length; j++) {
               let lateFeeAmount = new BigNumber(data.data[0].loans[i].loan.LateFees[j].amount);
               currentAmount = currentAmount.plus(lateFeeAmount);
          }

          // for each payment item, subtract the item
          for (let j = 0; j < data.data[0].loans[i].loan.PaymentHistory.length; j++) {
               let paymentAmount = new BigNumber(data.data[0].loans[i].loan.PaymentHistory[j].amount);
               currentAmount = currentAmount.minus(paymentAmount);
          }

          // for BigNumber.js X.comparedTo(Y), returns 1 if X > Y, returns - 1 if X < Y, returns 0 if equal 
          if (currentAmount.comparedTo(0) > 0) {
               // the loan IS NOT paid off
               data.data[0].loans[i].loan.PaidOff = false;
               data.data[0].loans[i].loan.CalculatedRemainingAmount = currentAmount.toFixed(2);

          } else {
               // the loan IS paid off
               data.data[0].loans[i].loan.PaidOff = true;
               data.data[0].loans[i].loan.CalculatedRemainingAmount = "0.00";
          }
     }

     return data;
}