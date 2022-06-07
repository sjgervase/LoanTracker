import { configureStore } from "@reduxjs/toolkit"; 

// import reducers from slices
import LoansReducer from "./features/LoansSlice";
import SettingsReducer from "./features/SettingsSlice";
import IncomesReducer from "./features/IncomesSlice";
import DeductionsReducer from "./features/DeductionsSlice";

// list reducers from slices
export default configureStore({
     reducer: {
          loans: LoansReducer,
          deductions: DeductionsReducer,
          incomes: IncomesReducer,
          settings: SettingsReducer
     },
})