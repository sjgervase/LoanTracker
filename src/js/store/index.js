import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";

import dataReducer from "../reducers/data";


export default function configureStore() {

     // causes dispatch into action
     const middlewares = [
          thunkMiddleware
     ];
     
     const store = createStore(
          combineReducers({
               data: dataReducer
          }),
          // from redux docs
          applyMiddleware(...middlewares)
     );

     return store;
}