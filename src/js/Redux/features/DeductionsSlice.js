import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ipcRenderer } from "electron";


// to fetch the deductions
export const fetchDeductions = createAsyncThunk('fetchDeductions', async () => {
     // get response from main process
     const response = await ipcRenderer.invoke('dataRequest');

     // return response, data[1] is the internal array for deductions
     return response.data[1].deductions;
})

// slice of store to hold all deductions
export const DeductionsSlice = createSlice({
     // name of slice
     name: 'deductions',
     
     // initial state
     initialState: {
          deductions: [],
          status: 'idle',
          error: null
     },

     // reducers list
     reducers: {
          // reducer to add an deductions
          addDeduction: (state, action) => {
               // push new deduction to the state
               state.deductions.push(action.payload);

               // finally, send data to main process to write to file
               ipcRenderer.invoke('writeDeductions', (["addDeduction", action.payload]));
          },

          // reducer to delete an deductions
          deleteDeduction: (state, action) => {
               // find the deduction that needs to be deleted based on GUID
               let thisIncomeIndex = state.deductions.findIndex(deduction => deduction.GUID === action.payload);

               // splice item from array
               state.deductions.splice(thisIncomeIndex, 1);

               // finally, send data to main process to write to file
               ipcRenderer.invoke('writeDeductions', (["deleteDeduction", action.payload]));
          },

          // reducer to edit an deductions
          editDeduction: (state, action) => {
               // find the income that needs to be editted based on GUID
               let thisDeduction = state.deductions.find(deduction => deduction.GUID === action.payload.GUID);

               // set all the properties of this income equal to the payload values
               thisDeduction.Amount = action.payload.Amount;
               thisDeduction.Frequency = action.payload.Frequency;
               thisDeduction.MonthlyAmount = action.payload.MonthlyAmount;
               thisDeduction.Name = action.payload.Name;

               // finally, send data to main process to write to file
               ipcRenderer.invoke('writeDeductions', (["editDeduction", action.payload]));
          },
     },

     // extra reducers for fetching data
     extraReducers(builder) {
          builder
               .addCase(fetchDeductions.pending, (state, action) => {
                    state.status = 'loading'
               })

               .addCase(fetchDeductions.fulfilled, (state, action) => {
                    state.status = 'succeeded';

                    // add deductions to the array
                    state.deductions = state.deductions.concat(action.payload)
               })

               .addCase(fetchDeductions.rejected, (state, action) => {
                    state.status = 'failed'
                    state.error = action.error.message
               })
     }
})

// export all actions
export const { 
     addDeduction,
     deleteDeduction,
     editDeduction
} = DeductionsSlice.actions;

// export slice
export default DeductionsSlice.reducer;

// NOTES:
// https://redux.js.org/tutorials/quick-start
// https://redux.js.org/tutorials/essentials/part-5-async-logic