// A store holds the whole state tree of your application.
// The only way to change the state inside is to dispatch an action on it. The store will then pass the new state received from the reducer to the component.

import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";

// import root reducer
import rootReducer from "./RootReducer";

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));