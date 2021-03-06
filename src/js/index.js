import React, { createContext } from 'react';
import ReactDOM from 'react-dom';

import App from "./App";

import { Root } from './App';

// import css, with custom css below bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

// Redux Store Imports
// for from react redux
import { Provider, useDispatch } from "react-redux";
// import store
import store from './Redux/store';


     


ReactDOM.render(
     <Provider store={store}>
          <Root/>
     </Provider>, document.getElementById("loanTracker_Container")
);