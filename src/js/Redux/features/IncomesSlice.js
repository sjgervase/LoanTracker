import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ipcRenderer } from "electron";

import { current } from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";


// to fetch the incomes
export const fetchIncomes = createAsyncThunk('fetchIncomes', async () => {
     // get response from main process
     const response = await ipcRenderer.invoke('dataRequest');

     // return response, data[2] is the internal array for incomes
     return response.data[2].incomes;
})

// slice of store to hold all incomes
export const IncomesSlice = createSlice({
     // name of slice
     name: 'incomes',
     
     // initial state
     initialState: {
          incomes: [],
          status: 'idle',
          error: null
     },

     // reducers list
     reducers: {
          // reducer to add an income
          addIncome: (state, action) => {
               // add income to array
               state.incomes.push(action.payload);

               // finally, send data to main process to write to file
               ipcRenderer.invoke('writeIncomes', (["addIncome", action.payload]));
          },

          // reducer to delete an income
          deleteIncome: (state, action) => {
               // find the income that needs to be deleted based on GUID
               let thisIncomeIndex = state.incomes.findIndex(income => income.GUID === action.payload);

               // splice item from array
               state.incomes.splice(thisIncomeIndex, 1);

               // finally, send data to main process to write to file
               ipcRenderer.invoke('writeIncomes', (["deleteIncome", action.payload]));
          },

          // reducer to edit an income
          editIncome: (state, action) => {
               // find the income that needs to be editted based on GUID
               let thisIncome = state.incomes.find(income => income.GUID === action.payload.GUID);

               // set all the properties of this income equal to the payload values
               thisIncome.Amount = action.payload.Amount;
               thisIncome.Frequency = action.payload.Frequency;
               thisIncome.MonthlyAmount = action.payload.MonthlyAmount;
               thisIncome.Name = action.payload.Name;

               // finally, send data to main process to write to file
               ipcRenderer.invoke('writeIncomes', (["editIncome", action.payload]));
          },
     },

     // extra reducers for fetching data
     extraReducers(builder) {
          builder
               .addCase(fetchIncomes.pending, (state, action) => {
                    state.status = 'loading'
               })

               .addCase(fetchIncomes.fulfilled, (state, action) => {
                    state.status = 'succeeded';

                    // add incomes to the array
                    state.incomes = state.incomes.concat(action.payload)
               })

               .addCase(fetchIncomes.rejected, (state, action) => {
                    state.status = 'failed'
                    state.error = action.error.message
               })
     }
})

// export all actions
export const { 
     addIncome,
     deleteIncome,
     editIncome
} = IncomesSlice.actions;

// export slice
export default IncomesSlice.reducer;

// NOTES:
// https://redux.js.org/tutorials/quick-start
// https://redux.js.org/tutorials/essentials/part-5-async-logic