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
          },

          // reducer to add an deductions
          clearFormData: (state, action) => {
               // delete all formdata
               Object.keys(state.formData).forEach(key => delete state.formData[key]);
               state.errors = null;
               state.validate = false;
          },

          // reducer to enter/exit validation mode
          validationMode: (state, action) => {
               // switch validate to true
               state.validate = action.payload;
          },

          // reducer to enter validation mode
          errorsExist: (state, action) => {
               // switch errors to payload
               state.errors = action.payload;
          },

          // reducer to clear data based on the repayment option selected
          repaymentOptionData: (state, action) => {
               // remove unneeded properties
               // if payback from total
               if (action.payload.RepaymentOption === "paybackFromTotal") {
                    delete state.formData.MonthlyPayment
                    delete state.formData.PresentValue
               } else {
                    delete state.formData.MonthlyPayment
                    delete state.formData.TotalTermLength
                    delete state.formData.TotalLoanAmount
               }

               // add the radio button selection to the formdata
               Object.assign(state.formData, action.payload)
          },
     },
})

// export all actions
export const { 
     addFieldToFormData,
     clearFormData,
     validationMode,
     errorsExist,
     repaymentOptionData,
} = AddALoanFormDataSlice.actions;

// export slice
export default AddALoanFormDataSlice.reducer;

// NOTES:
// https://redux.js.org/tutorials/quick-start
// https://redux.js.org/tutorials/essentials/part-5-async-logic