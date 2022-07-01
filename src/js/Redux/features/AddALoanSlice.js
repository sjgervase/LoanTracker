import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";



// slice of store to hold all form data
export const AddALoanFormDataSlice = createSlice({
     // name of slice
     name: 'addaloan',
     
     // initial state
     initialState: {
          formData:{},
          errors: null,
          validate: false,
     },

     // reducers list
     reducers: {
          // reducer to add an deductions
          addFieldToFormData: (state, action) => {
               // add field to the current formdata object
               Object.assign(state.formData, action.payload)

               // console.log(current(state));
          },

          // reducer to enter validation mode
          enterValidationMode: (state, action) => {
               // switch validate to true
               state.validate = true;
               

               console.log(current(state));
          },
     },
})

// export all actions
export const { 
     addFieldToFormData,
     enterValidationMode,
} = AddALoanFormDataSlice.actions;

// export slice
export default AddALoanFormDataSlice.reducer;

// NOTES:
// https://redux.js.org/tutorials/quick-start
// https://redux.js.org/tutorials/essentials/part-5-async-logic